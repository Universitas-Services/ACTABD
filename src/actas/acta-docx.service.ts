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
  // --- ANEXO PRIMERO: Situación Presupuestaria, Financiera y Patrimonial (1-24) ---
  q23_anexo_situacion_presupuestaria_detallada: {
    key: 'Anexo_1',
    text: '-Estado de Situación Presupuestaria mostrando todos los momentos presupuestarios y sus detalles.',
  },
  q24_anexo_gastos_comprometidos_no_causados: {
    key: 'Anexo_2',
    text: '-Relación de Gastos Comprometidos, no causados a la fecha de entrega.',
  },
  q25_anexo_gastos_causados_no_pagados: {
    key: 'Anexo_3',
    text: '-Relación de Gastos Comprometidos, causados y no pagados a la fecha de entrega.',
  },
  q26_anexo_estado_presupuestario_por_partidas: {
    key: 'Anexo_4',
    text: '-Estado Presupuestario del Ejercicio vigente por partidas.',
  },
  q27_anexo_estado_presupuestario_por_cuentas: {
    key: 'Anexo_5',
    text: '-Estado Presupuestario del Ejercicio con los detalles de sus cuentas.',
  },
  q28_anexo_estados_financieros: {
    key: 'Anexo_6',
    text: '-Estados Financieros a la fecha de entrega.',
  },
  q29_anexo_balance_comprobacion_y_notas: {
    key: 'Anexo_7',
    text: '-Balance de Comprobación a la fecha de elaboración de los Estados Financieros y sus notas explicativas.',
  },
  q30_anexo_estado_situacion_financiera_y_notas: {
    key: 'Anexo_8',
    text: '-Estado de Situación Financiera / Balance General y sus notas explicativas.',
  },
  q31_anexo_estado_rendimiento_financiero_y_notas: {
    key: 'Anexo_9',
    text: '-Estado de Rendimiento Financiero / Estado de Ganancia y Pérdidas y sus notas explicativas.',
  },
  q32_anexo_estado_movimiento_patrimonio_y_notas: {
    key: 'Anexo_10',
    text: '-Estado de Movimientos de las Cuentas de Patrimonio y sus notas explicativas.',
  },
  q33_anexo_relacion_cuentas_por_cobrar: {
    key: 'Anexo_11',
    text: '-Relación de Cuentas por Cobrar a la fecha del Acta de Entrega.',
  },
  q34_anexo_relacion_cuentas_por_pagar: {
    key: 'Anexo_12',
    text: '-Relación de Cuentas por Pagar a la fecha del Acta de Entrega.',
  },
  q35_anexo_relacion_fondos_terceros: {
    key: 'Anexo_13',
    text: '-Relación de las Cuentas de los Fondos de Terceros.',
  },
  q36_anexo_situacion_fondos_anticipo: {
    key: 'Anexo_14',
    text: '-Situación de los Fondos en Anticipo.',
  },
  q37_anexo_situacion_caja_chica: {
    key: 'Anexo_15',
    text: '-Situación de la Caja Chica.',
  },
  q38_anexo_acta_arqueo_caja_chica: {
    key: 'Anexo_16',
    text: '-Acta de arqueo de las Cajas Chicas a la fecha de entrega.',
  },
  q39_anexo_listado_registro_proveedores: {
    key: 'Anexo_17',
    text: '-Listado del Registro Auxiliar de Proveedores.',
  },
  q40_anexo_reporte_libros_contables: {
    key: 'Anexo_18',
    text: '-Reportes de Libros Contables (Diario y mayores analíticos) a la fecha del cese.',
  },
  q41_anexo_reporte_cuentas_bancarias: {
    key: 'Anexo_19',
    text: '-Reportes de las Cuentas Bancarias (Movimientos a la fecha del cese de funciones).',
  },
  q42_anexo_reporte_conciliaciones_bancarias: {
    key: 'Anexo_20',
    text: '-Reportes de las Conciliaciones Bancarias a la fecha del cese de funciones.',
  },
  q43_anexo_reporte_retenciones_pendientes: {
    key: 'Anexo_21',
    text: '-Reportes de Retenciones de pagos pendientes por enterar (ISLR, IVA y Contratos).',
  },
  q44_anexo_reporte_contrataciones_publicas: {
    key: 'Anexo_22',
    text: '-Reporte de los Procesos de Contrataciones Públicas a la fecha del cese.',
  },
  q45_anexo_reporte_fideicomiso_prestaciones: {
    key: 'Anexo_23',
    text: '-Reporte del Fideicomiso de Prestaciones Sociales a la fecha del cese.',
  },
  q46_anexo_reporte_bonos_vacacionales: {
    key: 'Anexo_24',
    text: '-Reporte de Bonos Vacacionales a la fecha del cese de funciones.',
  },

  // --- ANEXO SEGUNDO: Recursos Humanos (25-27) ---
  q47_anexo_mencion_numero_cargos_rrhh: {
    key: 'Anexo_25',
    text: '-Mención del número de cargos existentes (empleados, obreros, fijos, contratados, jubilados).',
  },
  q48_incluye_cuadro_resumen_cargos: {
    key: 'Anexo_26',
    text: '-Cuadro resumen indicando el número de cargos existentes y clasificación.',
  },
  q50_anexo_reporte_nominas: {
    key: 'Anexo_27',
    text: '-Reporte de Nóminas a la fecha del cese de funciones.',
  },

  // --- ANEXO TERCERO: Bienes (28) ---
  q51_anexo_inventario_bienes: {
    key: 'Anexo_28',
    text: '-Inventario de los Bienes Muebles e Inmuebles.',
  },

  // --- ANEXO CUARTO: Plan Operativo (29-31) ---
  q69_anexo_ejecucion_poa: {
    key: 'Anexo_29',
    text: '-Ejecución del Plan Operativo Anual de conformidad con objetivos y metas.',
  },
  q70_incluye_ejecucion_poa_fecha_entrega: {
    key: 'Anexo_30',
    text: '-Ejecución del Plan Operativo a la fecha de entrega.',
  },
  q72_incluye_plan_operativo_anual: {
    key: 'Anexo_31',
    text: '-Plan Operativo Anual.',
  },

  // --- ANEXO QUINTO: Archivo (32-33) ---
  q73_anexo_indice_general_archivo: {
    key: 'Anexo_32',
    text: '-Índice general del archivo.',
  },
  q74_archivo_indica_clasificacion: {
    key: 'Anexo_33',
    text: '-Documento con la clasificación del archivo.',
  },

  // --- ANEXO SEXTO: Información Adicional y Tesorería (34-56) ---
  q76_incluye_relacion_montos_fondos_asignados: {
    key: 'Anexo_34',
    text: '-Relación de los montos de los fondos asignados.',
  },
  q77_incluye_saldo_efectivo_fondos: {
    key: 'Anexo_35',
    text: '-Saldo en efectivo de los fondos asignados.',
  },
  q78_incluye_relacion_bienes_asignados: {
    key: 'Anexo_36',
    text: '-Relación de los bienes asignados.',
  },
  q79_incluye_relacion_bienes_unidad_bienes: {
    key: 'Anexo_37',
    text: '-Relación de los Bienes asignados emitida por la Unidad de Bienes.',
  },
  q80_incluye_estados_bancarios_conciliados: {
    key: 'Anexo_38',
    text: '-Estados bancarios actualizados y conciliados a la fecha de entrega.',
  },
  q81_incluye_lista_comprobantes_gastos: {
    key: 'Anexo_39',
    text: '-Lista de comprobantes de gastos.',
  },
  q82_incluye_cheques_pendientes_cobro: {
    key: 'Anexo_40',
    text: '-Cheques emitidos pendientes de cobro.',
  },
  q83_incluye_reporte_transferencias_bancarias: {
    key: 'Anexo_41',
    text: '-Listado o reporte de Transferencias Bancarias.',
  },
  q84_anexo_caucion_funcionario_admin: {
    key: 'Anexo_42',
    text: '-Caución del funcionario encargado de la Administración de los Recursos Financieros.',
  },
  q85_incluye_cuadro_liquidado_recaudado: {
    key: 'Anexo_43',
    text: '-Cuadro demostrativo de lo liquidado y recaudado, y derechos pendientes.',
  },
  q86_incluye_relacion_expedientes_investigacion: {
    key: 'Anexo_44',
    text: '-Relación de expedientes abiertos por potestad de investigación o procedimientos administrativos.',
  },
  q87_incluye_situacion_tesoro_nacional: {
    key: 'Anexo_45',
    text: '-Situación del Tesoro Nacional.',
  },
  q88_incluye_ejecucion_presupuesto_nacional: {
    key: 'Anexo_46',
    text: '-Ejecución del presupuesto nacional de ingresos y egresos.',
  },
  q89_incluye_monto_deuda_publica_nacional: {
    key: 'Anexo_47',
    text: '-Monto de la deuda pública nacional interna y externa.',
  },
  q90_incluye_situacion_cuentas_nacion: {
    key: 'Anexo_48',
    text: '-Situación de las cuentas de la Nación.',
  },
  q91_incluye_situacion_tesoro_estadal: {
    key: 'Anexo_49',
    text: '-Situación del Tesoro Estadal.',
  },
  q92_incluye_ejecucion_presupuesto_estadal: {
    key: 'Anexo_50',
    text: '-Ejecución del presupuesto estadal de ingresos y egresos.',
  },
  q93_incluye_situacion_cuentas_estadal: {
    key: 'Anexo_51',
    text: '-Situación de las cuentas del respectivo estado.',
  },
  q94_incluye_situacion_tesoro_municipal: {
    key: 'Anexo_52',
    text: '-Situación del Tesoro Distrital o Municipal.',
  },
  q95_incluye_ejecucion_presupuesto_municipal: {
    key: 'Anexo_53',
    text: '-Ejecución del presupuesto distrital o municipal.',
  },
  q96_incluye_situacion_cuentas_municipal: {
    key: 'Anexo_54',
    text: '-Situación de las cuentas distritales o municipales.',
  },
  q97_incluye_inventario_terrenos_municipales: {
    key: 'Anexo_55',
    text: '-Inventario detallado de terrenos ejidos y propios distritales o municipales.',
  },
  q98_incluye_relacion_ingresos_venta_terrenos: {
    key: 'Anexo_56',
    text: '-Relación de Ingresos por ventas de terrenos ejidos o propios.',
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
