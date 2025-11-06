// src/acta-compliance/acta-compliance.service.ts

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActaComplianceDto } from './dto/create-acta-compliance.dto';
import { UpdateActaComplianceDto } from './dto/update-acta-compliance.dto';
import { ActaCompliance } from '@prisma/client';

// Importaciones de tipos
import * as puppeteer from 'puppeteer';

import { FINDINGS_MAP, DB_KEYS_MAP } from './acta-compliance.constants';

@Injectable()
export class ActaComplianceService {
  // El constructor ahora SOLO inyecta dependencias de NestJS
  constructor(private prisma: PrismaService) {
    // ¡IMPORTANTE! El constructor está vacío de lógica de pdfmake.
  }

  /**
   * Crea un nuevo registro de checklist de cumplimiento.
   */
  async create(
    createActaComplianceDto: CreateActaComplianceDto,
    userId: string,
  ): Promise<ActaCompliance> {
    const puntajeCalculado = this.calculateScore(createActaComplianceDto);
    const resumenCumplimiento = this.generateSummary(
      puntajeCalculado,
      createActaComplianceDto,
    );

    try {
      const newCompliance = await this.prisma.actaCompliance.create({
        data: {
          ...createActaComplianceDto,
          puntajeCalculado,
          resumenCumplimiento,
          userId: userId,
        },
      });
      return newCompliance;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new Error(
        `Error al crear el registro de cumplimiento: ${errorMessage}`,
      );
    }
  }

  /**ls
   *
   * Obtiene todos los checklists de cumplimiento (general).
   */
  async findAll(): Promise<ActaCompliance[]> {
    return this.prisma.actaCompliance.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, email: true, nombre: true } } },
    });
  }

  /**
   * Obtiene todos los checklists de cumplimiento CREADOS POR un usuario específico.
   */
  async findAllForUser(userId: string): Promise<ActaCompliance[]> {
    return this.prisma.actaCompliance.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Obtiene un checklist específico por su ID, VERIFICANDO PROPIEDAD.
   */
  async findOneForUser(id: string, userId: string): Promise<ActaCompliance> {
    const compliance = await this.prisma.actaCompliance.findUnique({
      where: { id },
    });
    if (!compliance) {
      throw new NotFoundException(
        `Checklist de cumplimiento con ID ${id} no encontrado.`,
      );
    }
    if (compliance.userId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para acceder a este registro.',
      );
    }
    return compliance;
  }

  /**
   * Actualiza un checklist de cumplimiento, VERIFICANDO PROPIEDAD.
   */
  async update(
    id: string,
    updateActaComplianceDto: UpdateActaComplianceDto,
    userId: string,
  ): Promise<ActaCompliance> {
    const existingData = await this.findOneForUser(id, userId);
    const newData = { ...existingData, ...updateActaComplianceDto };

    const puntajeCalculado = this.calculateScore(newData);
    const resumenCumplimiento = this.generateSummary(puntajeCalculado, newData);

    const updatedCompliance = await this.prisma.actaCompliance.update({
      where: { id },
      data: {
        ...updateActaComplianceDto,
        puntajeCalculado,
        resumenCumplimiento,
      },
    });
    return updatedCompliance;
  }

  /**
   * Elimina un checklist de cumplimiento, VERIFICANDO PROPIEDAD.
   */
  async remove(id: string, userId: string): Promise<ActaCompliance> {
    await this.findOneForUser(id, userId);
    return await this.prisma.actaCompliance.delete({ where: { id } });
  }

  // --- ÚNICA IMPLEMENTACIÓN DEL MÉTODO PARA GENERAR PDF ---
  /**
   * Genera el buffer del PDF para un reporte específico.
   */
  async generatePdfBuffer(
    reporteId: string,
    userId: string,
  ): Promise<{ buffer: Buffer; reporte: ActaCompliance }> {
    const reporte = await this.findOneForUser(reporteId, userId);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const htmlContent = this.generateHtmlContent(reporte);
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '40px', right: '40px', bottom: '60px', left: '40px' },
    });

    await browser.close();

    return { buffer: pdfBuffer as Buffer, reporte };
  }

  /**
   * Construye el contenido HTML para Puppeteer a partir de los datos del reporte.
   */
  private generateHtmlContent(reporte: ActaCompliance): string {
    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Reporte de Acta de Cumplimiento</title>
            <style>
                body { font-family: 'Roboto', sans-serif; margin: 0; padding: 0; }
                .header { font-size: 16px; font-weight: bold; text-align: center; margin-top: 30px; }
                .header-info { font-size: 9px; margin: 10px 0 20px 0; display: grid; grid-template-columns: auto 1fr auto 1fr; gap: 5px; }
                .header-info b { font-weight: bold; }
                table { width: 100%; border-collapse: collapse; margin: 5px 0 15px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: center; font-size: 8px; }
                th { background-color: #EEEEEE; font-weight: bold; }
                .cell-left { text-align: left; }
                .cell-highlight { font-size: 7px; text-align: left; color: red; }
                .subheader { font-size: 14px; font-weight: bold; margin: 15px 0 10px 0; page-break-before: always; }
                .subtitle { font-size: 12px; font-weight: bold; margin: 10px 0 5px 0; }
                .body-text { font-size: 10px; text-align: justify; }
                .observacion-item { font-size: 9px; margin-bottom: 10px; text-align: justify; }
            </style>
        </head>
        <body>
            <div class="header">REGISTRO DE HALLAZGOS U OBSERVACIONES - ACTA DE ENTREGA</div>
            <div class="header-info">
                <b>ENTE U ORGANISMO:</b><span>${reporte.nombre_organo_entidad || 'N/A'}</span>
                <b>UNIDAD REVISORA:</b><span>${reporte.nombre_unidad_revisora || 'N/A'}</span>
                <b>CÓDIGO:</b><span>${reporte.codigo_documento_revisado || 'N/A'}</span>
                <b>ELABORADO POR:</b><span>${reporte.nombre_completo_revisor || 'N/A'}</span>
                <b>FECHA:</b><span>${reporte.fecha_revision ? new Date(reporte.fecha_revision).toLocaleDateString() : 'N/A'}</span>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Nº</th>
                        <th>BÚSQUEDA</th>
                        <th>CUMPLE</th>
                        <th>CONDICIÓN</th>
                        <th>CRITERIO</th>
                    </tr>
                </thead>
                <tbody>
    `;

    const observacionesHtml: string[] = [];

    DB_KEYS_MAP.forEach((dbKey, index) => {
      const i = index + 1;
      // @ts-expect-error - Accediendo dinámicamente
      const answer: boolean | null | undefined = reporte[dbKey];
      const answerText = this.mapBooleanToAnswer(answer);
      const findingData =
        FINDINGS_MAP[dbKey as keyof typeof FINDINGS_MAP] || {}; // Provide a default empty object if not found

      let condicionCell = '';
      let criterioCell = '';

      if (answer === false) {
        condicionCell = `<td class="cell-highlight">${findingData.condicion}</td>`;
        criterioCell = `<td class="cell-highlight">${findingData.criterio}</td>`;
        observacionesHtml.push(
          `<div class="observacion-item">${findingData.observacionHtml}</div>`,
        );
      } else {
        condicionCell = `<td></td>`;
        criterioCell = `<td></td>`;
      }

      html += `
            <tr>
                <td>${i}</td>
                <td class="cell-left">${findingData.pregunta}</td>
                <td>${answerText}</td>
                ${condicionCell}
                ${criterioCell}
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>

            <div class="subheader">RESUMEN EJECUTIVO A REVISIÓN ACTA DE ENTREGA</div>
            <div class="subtitle">ALCANCE</div>
            <p class="body-text">Se ha realizado una revisión exhaustiva del Acta de Entrega y sus documentos anexos, con el propósito de identificar posibles incumplimientos de las normas establecidas por la Contraloría General de la República para Regular la Entrega de los Órganos y Entidades de la Administración Pública y de sus Respectivas Oficinas o Dependencias (Resolución N° 01-00-000162 de fecha 28 de julio de 2009).<br>Es importante destacar que esta revisión no constituye una auditoría de control fiscal, sino que se enmarca como un mecanismo de control interno.<br>Su objetivo es advertir sobre los riesgos legais asociados al levantamiento del Acta de Entrega y proponer acciones correctivas que permitan prevenir responsabilidades civiles, penales o administrativas para los funcionarios involucrados.</p>
            
            <div class="subtitle">HALLAZGOS</div>
            <p class="body-text">${reporte.resumenCumplimiento || 'No se generó resumen.'}</p>

            <div class="subtitle">IMPLICACIONES DEL INCUMPLIMIENTO DE LAS NORMAS DE ENTREGA</div>
            <p class="body-text">El incumplimiento de las normas de entrega conlleva serias implicaciones tanto para los funcionarios involucrados como para el patrimonio público. Entre las principales consecuencias se encuentran: Responsabilidad Administrativa, Riesgo de Pérdida o DeteriorO del Patrimonio Público, Acciones Correctivas, Investigaciones y Procedimientos Administrativos, y Sanciones Legales.</p>

            <div class="subtitle">NIVEL DE RIESGO POR HALLAZGOS RESULTANTES</div>
            <p class="body-text">Este es el texto que corresponde a {{TEXTO}} en tu plantilla. Deberías guardarlo en tu BD o definirlo aquí.</p>

            <div class="subtitle">SOLUCIÓN Y LLAMADO A LA ACCIÓN</div>
            <ul class="body-text">
                <li>Concertar una reunión, ya sea presencial o virtual, con el equipo de Universitas Legal...</li>
                <li>Revisar el “Reporte de Hallazgos” con su Equipo de Trabajo...</li>
                <li>Revisar y reforzar la capacitación de su equipo de trabajo...</li>
                <li>Formalizar las observaciones, para ello, pueden Imprimir, suscribir y presentar la observación...</li>
            </ul>
            
            <div class="subheader">OBSERVACIONES AL ACTA DE ENTREGA (ANEXO)</div>
            ${observacionesHtml.length > 0 ? observacionesHtml.join('') : '<p class="body-text">No se encontraron hallazgos.</p>'}
        </body>
        </html>
    `;
    return html;
  }

  // --- El resto de tus métodos de cálculo (sin cambios) ---
  private mapBooleanToAnswer(value: boolean | null | undefined): string {
    if (value === true) return 'SI';
    if (value === false) return 'NO';
    return 'NO aplica';
  }

  private getPonderaciones(): { [key: string]: number } {
    return {
      q1: 1,
      q2: 1,
      q3: 1,
      q4: 1,
      q5: 1,
      q6: 1,
      q7: 1,
      q8: 1,
      q9: 1,
      q10: 2,
      q11: 2,
      q12: 2,
      q13: 1,
      q14: 2,
      q15: 2,
      q16: 2,
      q17: 1,
      q18: 1,
      q19: 1,
      q20: 1,
      q21: 0,
      q22: 1,
      q23: 2,
      q24: 0,
      q25: 2,
      q26: 2,
      q27: 2,
      q28: 1,
      q29: 1.3,
      q30: 1.31,
      q31: 1.32,
      q32: 1.33,
      q33: 1.34,
      q34: 1.35,
      q35: 1.36,
      q36: 1.37,
      q37: 1.38,
      q38: 1.39,
      q39: 1.4,
      q40: 1.41,
      q41: 1.42,
      q42: 1.43,
      q43: 1.44,
      q44: 1.45,
      q45: 1.46,
      q46: 1.47,
      q47: 1.48,
      q48: 1.49,
      q49: 1.5,
      q50: 1.51,
      q51: 1.52,
      q52: 1.53,
      q53: 1.54,
      q54: 1.55,
      q55: 1.56,
      q56: 1.57,
      q57: 1.58,
      q58: 1.59,
      q59: 1.6,
      q60: 1.61,
      q61: 1.62,
      q62: 1.63,
      q63: 1.64,
      q64: 1.65,
      q65: 1.66,
      q66: 1.67,
      q67: 1.68,
      q68: 1.69,
      q69: 1.7,
      q70: 1.71,
      q71: 1.72,
      q72: 1.73,
      q73: 1.74,
      q74: 1.75,
      q75: 1.76,
      q76: 0,
      q77: 0,
      q78: 0,
      q79: 0,
      q80: 0,
      q81: 0,
      q82: 0,
      q83: 0,
      q84: 0,
      q85: 0,
      q86: 0,
      q87: 0,
      q88: 0,
      q89: 0,
      q90: 0,
      q91: 0,
      q92: 0,
      q93: 0,
      q94: 0,
      q95: 0,
      q96: 0,
      q97: 0,
      q98: 0,
    };
  }

  private calculateScore(data: Record<string, any>): number {
    const ponderaciones = this.getPonderaciones();
    let totalPonderacionAplicable = 0;
    let obtainedScore = 0;

    for (let i = 1; i <= 98; i++) {
      const dataKey = Object.keys(data).find((k) => k.startsWith(`q${i}_`));
      const ponderacionKey = `q${i}`;
      const ponderacion = ponderaciones[ponderacionKey];

      if (dataKey && (data[dataKey] === true || data[dataKey] === false)) {
        if (ponderacion) {
          totalPonderacionAplicable += ponderacion;
          if (data[dataKey] === true) {
            obtainedScore += ponderacion;
          }
        }
      }
    }

    if (totalPonderacionAplicable === 0) {
      return 100;
    }

    const scorePercentage = (obtainedScore / totalPonderacionAplicable) * 100;
    return Math.round(scorePercentage);
  }

  private generateSummary(score: number, data: Record<string, any>): string {
    let algunaRespuesta = false;
    for (let i = 1; i <= 98; i++) {
      const dataKey = Object.keys(data).find((k) => k.startsWith(`q${i}_`));
      if (dataKey && (data[dataKey] === true || data[dataKey] === false)) {
        algunaRespuesta = true;
        break;
      }
    }

    if (!algunaRespuesta) {
      return 'Tras revisar las respuestas obtenidas en el Formulario de Revisión de Cumplimiento para el Acta de Entrega, hemos identificado que los resultados indican Ausencia del documento objeto de la revisión; lamentamos informar que esta situación supone un incumplimiento general de la normativa y la imposibilidad de aplicar el resto del formato de evaluación.';
    }

    const textoBase =
      'Tras revisar las respuestas obtenidas en el Formulario de Revisión de Cumplimiento para el Acta de Entrega, hemos identificado que los resultados reflejan incumplimientos con respecto a las normas establecidas por la Contraloría General de la República. Estas normas regulan la entrega de los órganos y entidades de la administración pública, así como de sus respectivas oficinas o dependencias, conforme a la Resolución N° 01-00-000162 del 28 de julio de 2009.';
    const puntajeTexto = `con una puntuación de (${score}/100)`;

    if (score >= 1 && score <= 50) {
      return `${textoBase} Los incumplimientos han sido clasificados en un nivel Alto o Crítico, ${puntajeTexto}. Esta calificación indica la existencia de fallos significativos o sustanciales en la correcta aplicación de la normativa legal, lo que requiere atención inmediata para asegurar el cumplimiento de los estándares establecidos.`;
    }
    if (score >= 51 && score <= 75) {
      return `${textoBase} Los incumplimientos han sido clasificados en un nivel Intermedio, ${puntajeTexto}. Esta calificación indica la existencia de fallos interpretativos o desconocimiento en la correcta aplicación de la normativa legal, lo que requiere atención inmediata para asegurar el cumplimiento de los estándares establecidos.`;
    }
    if (score >= 76 && score <= 99) {
      return `${textoBase} Los incumplimientos han sido clasificados en un nivel Bajo o Leve, ${puntajeTexto}, Esta calificación indica la existencia de fallos por deficiencias o inexactitudes en la correcta aplicación de la normativa legal, lo que requiere atención inmediata para asegurar el cumplimiento de los estándares establecidos.`;
    }
    if (score === 100) {
      return `Tras revisar las respuestas obtenidas en el Formulario de Revisión de Cumplimiento para el Acta de Entrega, los resultados indican un cumplimiento total con las normas establecidas por la Contraloría General de la República, conforme a la Resolución N° 01-00-000162 del 28 de julio de 2009. La puntuación obtenida es (${score}/100).`;
    }

    return 'Tras revisar las respuestas, se ha determinado un puntaje de 0, indicando incumplimiento total en los items evaluados.';
  }
}
