// src/actas/acta-docx.service.ts

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { Acta, ActaType } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

// Desactivamos la regla que prohíbe 'require'
// eslint-disable-next-line @typescript-eslint/no-require-imports
import HTMLtoDOCX = require('html-to-docx');

interface AnexoInfo {
  key: string;
  text: string;
}

// Objeto que mapea las preguntas del formulario al texto completo de los Anexos
const anexosMap: Record<string, AnexoInfo> = {
  disponeEstadoSituacionPresupuestaria: {
    key: 'Anexo_1',
    text: '-El Estado de Situación Presupuestaria muestra todos los momentos presupuestarios y sus detalles. Incluye: Presupuesto Original, Modificaciones, Presupuesto Modificado, Compromisos, Causado, Pagado, Por Pagar y Presupuesto Disponible a la fecha de entrega.',
  },
  // ... (todo tu anexosMap va aquí, está perfecto) ...
  disponeRelacionIngresosVentaTerrenos: {
    key: 'Anexo_56',
    text: '-Relación de Ingresos producto de las ventas de terrenos ejidos o terrenos propios distritales o municipales.',
  },
};

@Injectable()
export class ActaDocxService {
  constructor(private readonly emailService: EmailService) {}

  /**
   * Genera el .docx y lo devuelve como un Buffer (para descargar)
   */
  async generarDocxBuffer(acta: Acta): Promise<Buffer> {
    try {
      // 1. Obtener la plantilla HTML
      const htmlTemplate = this.obtenerPlantillaHtml(acta.type);

      // 2. Rellenar la plantilla con la LÓGICA INTELIGENTE
      const htmlContent = this.remplazarPlaceholders(
        htmlTemplate,
        acta.metadata as Record<string, unknown>, // Pasa los datos crudos
      );

      // --- ¡CORRECCIÓN 2: ERROR "unsafe-call"! ---
      // Desactivamos la regla de ESLint solo para esta línea,
      // porque sabemos que HTMLtoDOCX es una función.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const fileBuffer = await HTMLtoDOCX(htmlContent, null, {
        table: { row: { cantSplit: true } },
        footer: false,
        header: false,
      });

      return fileBuffer as Buffer;
    } catch (error: unknown) {
      const actaId = acta?.id ?? 'ID no disponible';
      console.error(
        `Raw error when generating DOCX for Acta ID ${actaId}:`,
        error,
      );

      // Lógica simplificada que evita el error de ESLint
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Error al generar el documento: ${error.message}`,
        );
      }

      throw new InternalServerErrorException(
        'Error al generar el documento: Ocurrió un error desconocido.',
      );
    }
  }

  /**
   * Genera el .docx y lo envía por email (para enviar)
   */
  async generarYEnviarActa(acta: Acta, userEmail: string, userName: string) {
    try {
      // 1. Generas el buffer
      const fileBuffer = await this.generarDocxBuffer(acta);

      // 2. Preparas el nombre del archivo
      const filename = `Acta-Entrega-${acta.numeroActa}.docx`;

      // 3. Pasamos los 4 argumentos
      await this.emailService.sendActaDocxAttachment(
        userEmail,
        fileBuffer,
        filename,
        userName,
      );
    } catch (error: unknown) {
      const actaId = acta?.id ?? 'ID no disponible';
      console.error(
        `Raw error when generating and sending DOCX for Acta ID ${actaId}:`,
        error,
      );

      // Lógica simplificada que evita el error de ESLint
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Error al generar y enviar el documento: ${error.message}`,
        );
      }

      throw new InternalServerErrorException(
        'Error al generar y enviar el documento: Ocurrió un error desconocido.',
      );
    }
  }

  /**
   * Obtiene la plantilla HTML (sin cambios)
   */
  private obtenerPlantillaHtml(tipoActa: ActaType): string {
    let templateName = '';

    // --- ¡CORRECCIÓN 3: ERRORES DE CASOS DUPLICADOS! ---
    // Limpié el 'switch' para que no haya 'case' repetidos.
    switch (tipoActa) {
      // --- GRUPO ENTRANTE ---
      case ActaType.ENTRANTE_PAGA:
        templateName = 'actaEntregaPaga.html';
        break;
      case ActaType.ENTRANTE_GRATIS:
        templateName = 'actaEntregaPaga.html';
        break;

      // --- GRUPO SALIENTE ---
      case ActaType.SALIENTE_PAGA:
        templateName = 'actaSalientePaga.html';
        break;
      case ActaType.SALIENTE_GRATIS:
        templateName = 'actaSalientePaga.html';
        break;

      // --- GRUPO MÁXIMA AUTORIDAD ---
      case ActaType.MAXIMA_AUTORIDAD_PAGA:
        templateName = 'actaMaximaAutoridadPaga.html';
        break;
      case ActaType.MAXIMA_AUTORIDAD_GRATIS:
        templateName = 'actaMaximaAutoridadPaga.html';
        break;

      default:
        throw new NotFoundException(
          `Plantilla para el tipo de acta "${String(tipoActa)}" no encontrada.`,
        );
    }
    // --- FIN CORRECCIÓN 3 ---

    const templatePath = path.join(__dirname, '..', 'templates', templateName);
    if (!fs.existsSync(templatePath)) {
      throw new InternalServerErrorException(
        `Archivo de plantilla no encontrado en: ${templatePath}`,
      );
    }
    return fs.readFileSync(templatePath, 'utf-8');
  }

  /**
   * Reemplaza los placeholders usando la LÓGICA COMPLETA de dos pasos de Express
   */
  private remplazarPlaceholders(
    html: string,
    rawData: Record<string, unknown>, // Datos crudos del 'metadata' (ej. { dispone...: "SI" })
  ): string {
    let htmlContent = html;

    // PASO 1: Pre-procesar los datos
    const processedData: Record<string, unknown> = { ...rawData };

    for (const pregunta in anexosMap) {
      if (Object.prototype.hasOwnProperty.call(anexosMap, pregunta)) {
        const anexoInfo = anexosMap[pregunta];
        const respuestaUsuario =
          (rawData[pregunta] as string | undefined)?.toString() || '';

        if (respuestaUsuario.toUpperCase() === 'SI') {
          processedData[anexoInfo.key] = anexoInfo.text;
        } else if (respuestaUsuario.toUpperCase() === 'NO') {
          processedData[anexoInfo.key] = `FALTA: ${anexoInfo.text || pregunta}`;
        } else {
          processedData[anexoInfo.key] = '';
        }
      }
    }

    // PASO 2: Eliminación de párrafos vacíos
    for (const key in processedData) {
      if (key.startsWith('Anexo_') && processedData[key] === '') {
        const regex = new RegExp(
          `<p[^>]*>\\s*{{${key}}}\\s*<\\/p>[\\r\\n]*`,
          'g',
        );
        htmlContent = htmlContent.replace(regex, '');
      }
    }

    // PASO 3: Reemplazo final
    for (const key in processedData) {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      const value = processedData[key];

      let stringValue = ''; // Valor por defecto
      if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
      ) {
        stringValue = String(value);
      }
      htmlContent = htmlContent.replace(placeholder, stringValue);
    }

    // PASO 4: Limpieza final
    htmlContent = htmlContent.replace(/{{[^}]+}}/g, '');

    return htmlContent;
  }
}
