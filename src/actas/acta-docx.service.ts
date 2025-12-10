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

// 🔥 CORRECCIÓN: Mapeo actualizado para coincidir con tu JSON (dispone...)
const anexosMap: Record<string, AnexoInfo> = {
  // --- ANEXO PRIMERO: Situación Presupuestaria, Financiera y Patrimonial ---
  disponeEstadoSituacionPresupuestaria: {
    key: 'Anexo_1',
    text: '-Estado de Situación Presupuestaria mostrando todos los momentos presupuestarios y sus detalles.',
  },
  disponeRelacionGastosComprometidosNoCausados: {
    key: 'Anexo_2',
    text: '-Relación de Gastos Comprometidos, no causados a la fecha de entrega.',
  },
  disponeRelacionGastosComprometidosCausadosNoPagados: {
    key: 'Anexo_3',
    text: '-Relación de Gastos Comprometidos, causados y no pagados a la fecha de entrega.',
  },
  disponeEstadoPresupuestarioPorPartidas: {
    key: 'Anexo_4',
    text: '-Estado Presupuestario del Ejercicio vigente por partidas.',
  },
  disponeEstadoPresupuestarioDetalleCuentas: {
    key: 'Anexo_5',
    text: '-Estado Presupuestario del Ejercicio con los detalles de sus cuentas.',
  },
  disponeEstadosFinancieros: {
    key: 'Anexo_6',
    text: '-Estados Financieros a la fecha de entrega.',
  },
  disponeBalanceComprobacion: {
    key: 'Anexo_7',
    text: '-Balance de Comprobación a la fecha de elaboración de los Estados Financieros y sus notas explicativas.',
  },
  disponeEstadoSituacionFinanciera: {
    key: 'Anexo_8',
    text: '-Estado de Situación Financiera / Balance General y sus notas explicativas.',
  },
  disponeEstadoRendimientoFinanciero: {
    key: 'Anexo_9',
    text: '-Estado de Rendimiento Financiero / Estado de Ganancia y Pérdidas y sus notas explicativas.',
  },
  disponeEstadoMovimientosPatrimonio: {
    key: 'Anexo_10',
    text: '-Estado de Movimientos de las Cuentas de Patrimonio y sus notas explicativas.',
  },
  disponeRelacionCuentasPorCobrar: {
    key: 'Anexo_11',
    text: '-Relación de Cuentas por Cobrar a la fecha del Acta de Entrega.',
  },
  disponeRelacionCuentasPorPagar: {
    key: 'Anexo_12',
    text: '-Relación de Cuentas por Pagar a la fecha del Acta de Entrega.',
  },
  disponeRelacionCuentasFondosTerceros: {
    key: 'Anexo_13',
    text: '-Relación de las Cuentas de los Fondos de Terceros.',
  },
  disponeSituacionFondosAnticipo: {
    key: 'Anexo_14',
    text: '-Situación de los Fondos en Anticipo.',
  },
  disponeSituacionCajaChica: {
    key: 'Anexo_15',
    text: '-Situación de la Caja Chica.',
  },
  disponeActaArqueoCajasChicas: {
    key: 'Anexo_16',
    text: '-Acta de arqueo de las Cajas Chicas a la fecha de entrega.',
  },
  disponeListadoRegistroAuxiliarProveedores: {
    key: 'Anexo_17',
    text: '-Listado del Registro Auxiliar de Proveedores.',
  },
  disponeReportesLibrosContables: {
    key: 'Anexo_18',
    text: '-Reportes de Libros Contables (Diario y mayores analíticos) a la fecha del cese.',
  },
  disponeReportesCuentasBancarias: {
    key: 'Anexo_19',
    text: '-Reportes de las Cuentas Bancarias (Movimientos a la fecha del cese de funciones).',
  },
  disponeReportesConciliacionesBancarias: {
    key: 'Anexo_20',
    text: '-Reportes de las Conciliaciones Bancarias a la fecha del cese de funciones.',
  },
  disponeReportesRetenciones: {
    key: 'Anexo_21',
    text: '-Reportes de Retenciones de pagos pendientes por enterar (ISLR, IVA y Contratos).',
  },
  disponeReporteProcesosContrataciones: {
    key: 'Anexo_22',
    text: '-Reporte de los Procesos de Contrataciones Públicas a la fecha del cese.',
  },
  disponeReporteFideicomisoPrestaciones: {
    key: 'Anexo_23',
    text: '-Reporte del Fideicomiso de Prestaciones Sociales a la fecha del cese.',
  },
  disponeReporteBonosVacacionales: {
    key: 'Anexo_24',
    text: '-Reporte de Bonos Vacacionales a la fecha del cese de funciones.',
  },

  // --- ANEXO SEGUNDO: Recursos Humanos ---
  // Mapeamos 'disponeCuadroResumenCargos' a Anexo_26 (Cuadro resumen).
  // Si necesitas Anexo_25 (Mención de número de cargos), verifica si usas esa clave en el front.
  disponeCuadroResumenCargos: {
    key: 'Anexo_26',
    text: '-Cuadro resumen indicando el número de cargos existentes y clasificación.',
  },
  disponeReporteNominas: {
    key: 'Anexo_27',
    text: '-Reporte de Nóminas a la fecha del cese de funciones.',
  },
  
  // --- ANEXO TERCERO: Bienes ---
  disponeInventarioBienes: {
    key: 'Anexo_28',
    text: '-Inventario de los Bienes Muebles e Inmuebles.',
  },

  // --- ANEXO CUARTO: Plan Operativo ---
  disponeEjecucionPlanOperativo: {
    key: 'Anexo_29',
    text: '-Ejecución del Plan Operativo Anual de conformidad con objetivos y metas.',
  },
  // Si tienes una clave específica para "fecha entrega POA", úsala aquí.
  // Asumo que si hay ejecución, se incluye.
  disponePlanOperativoAnual: {
    key: 'Anexo_31',
    text: '-Plan Operativo Anual.',
  },

  // --- ANEXO QUINTO: Archivo ---
  // Tu JSON tiene 'disponeClasificacionArchivo'. El Anexo 33 es Clasificación.
  disponeClasificacionArchivo: {
    key: 'Anexo_33',
    text: '-Documento con la clasificación del archivo.',
  },
  // Si necesitas el índice (Anexo 32), agrega la clave correspondiente si la tienes.

  // --- ANEXO SEXTO: Información Adicional y Tesorería ---
  disponeRelacionMontosFondosAsignados: {
    key: 'Anexo_34',
    text: '-Relación de los montos de los fondos asignados.',
  },
  disponeSaldoEfectivoFondos: {
    key: 'Anexo_35',
    text: '-Saldo en efectivo de los fondos asignados.',
  },
  disponeRelacionBienesAsignados: {
    key: 'Anexo_36',
    text: '-Relación de los bienes asignados.',
  },
  disponeRelacionBienesAsignadosUnidadBienes: {
    key: 'Anexo_37',
    text: '-Relación de los Bienes asignados emitida por la Unidad de Bienes.',
  },
  disponeEstadosBancariosConciliados: {
    key: 'Anexo_38',
    text: '-Estados bancarios actualizados y conciliados a la fecha de entrega.',
  },
  disponeListaComprobantesGastos: {
    key: 'Anexo_39',
    text: '-Lista de comprobantes de gastos.',
  },
  disponeChequesEmitidosPendientesCobro: {
    key: 'Anexo_40',
    text: '-Cheques emitidos pendientes de cobro.',
  },
  disponeListadoTransferenciaBancaria: {
    key: 'Anexo_41',
    text: '-Listado o reporte de Transferencias Bancarias.',
  },
  disponeCaucionFuncionario: {
    key: 'Anexo_42',
    text: '-Caución del funcionario encargado de la Administración de los Recursos Financieros.',
  },
  disponeCuadroDemostrativoRecaudado: {
    key: 'Anexo_43',
    text: '-Cuadro demostrativo de lo liquidado y recaudado, y derechos pendientes.',
  },
  disponeRelacionExpedientesAbiertos: {
    key: 'Anexo_44',
    text: '-Relación de expedientes abiertos por potestad de investigación o procedimientos administrativos.',
  },
  disponeSituacionTesoroNacional: {
    key: 'Anexo_45',
    text: '-Situación del Tesoro Nacional.',
  },
  disponeInfoEjecucionPresupuestoNacional: {
    key: 'Anexo_46',
    text: '-Ejecución del presupuesto nacional de ingresos y egresos.',
  },
  disponeMontoDeudaPublicaNacional: {
    key: 'Anexo_47',
    text: '-Monto de la deuda pública nacional interna y externa.',
  },
  disponeSituacionCuentasNacion: {
    key: 'Anexo_48',
    text: '-Situación de las cuentas de la Nación.',
  },
  disponeSituacionTesoroEstadal: {
    key: 'Anexo_49',
    text: '-Situación del Tesoro Estadal.',
  },
  disponeInfoEjecucionPresupuestoEstadal: {
    key: 'Anexo_50',
    text: '-Ejecución del presupuesto estadal de ingresos y egresos.',
  },
  disponeSituacionCuentasEstado: {
    key: 'Anexo_51',
    text: '-Situación de las cuentas del respectivo estado.',
  },
  disponeSituacionTesoroDistritalMunicipal: {
    key: 'Anexo_52',
    text: '-Situación del Tesoro Distrital o Municipal.',
  },
  disponeInfoEjecucionPresupuestoDistritalMunicipal: {
    key: 'Anexo_53',
    text: '-Ejecución del presupuesto distrital o municipal.',
  },
  disponeSituacionCuentasDistritalesMunicipales: {
    key: 'Anexo_54',
    text: '-Situación de las cuentas distritales o municipales.',
  },
  disponeInventarioTerrenosEjidos: {
    key: 'Anexo_55',
    text: '-Inventario detallado de terrenos ejidos y propios distritales o municipales.',
  },
  disponeRelacionIngresosVentaTerrenos: {
    key: 'Anexo_56',
    text: '-Relación de Ingresos por ventas de terrenos ejidos o propios.',
  },
};

@Injectable()
export class ActaDocxService {
  constructor(private readonly emailService: EmailService) {}

  async generarDocxBuffer(acta: Acta): Promise<Buffer> {
    try {
      const htmlTemplate = this.obtenerPlantillaHtml(acta.type);

      // Aquí usamos la metadata tal cual viene de la BD
      const htmlContent = this.remplazarPlaceholders(
        htmlTemplate,
        acta.metadata as Record<string, unknown>,
      );

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

  async generarYEnviarActa(acta: Acta, userEmail: string, userName: string) {
    try {
      const fileBuffer = await this.generarDocxBuffer(acta);
      const filename = `Acta-Entrega-${acta.numeroActa}.docx`;

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

  private obtenerPlantillaHtml(tipoActa: ActaType): string {
    let templateName = '';

    switch (tipoActa) {
      case ActaType.ENTRANTE_PAGA:
      case ActaType.ENTRANTE_GRATIS:
        templateName = 'actaEntregaPaga.html';
        break;
      case ActaType.SALIENTE_PAGA:
      case ActaType.SALIENTE_GRATIS:
        templateName = 'actaSalientePaga.html';
        break;
      case ActaType.MAXIMA_AUTORIDAD_PAGA:
      case ActaType.MAXIMA_AUTORIDAD_GRATIS:
        templateName = 'actaMaximaAutoridadPaga.html';
        break;
      default:
        throw new NotFoundException(
          `Plantilla para el tipo de acta "${String(tipoActa)}" no encontrada.`,
        );
    }

    const templatePath = path.join(__dirname, '..', 'templates', templateName);
    if (!fs.existsSync(templatePath)) {
      throw new InternalServerErrorException(
        `Archivo de plantilla no encontrado en: ${templatePath}`,
      );
    }
    return fs.readFileSync(templatePath, 'utf-8');
  }

  private remplazarPlaceholders(
    html: string,
    rawData: Record<string, unknown>,
  ): string {
    let htmlContent = html;
    
    // PASO 1: Pre-procesar los datos (Lógica para Anexos)
    const processedData: Record<string, unknown> = { ...rawData };

    // Iteramos sobre el mapa actualizado 'anexosMap'
    for (const userKey in anexosMap) {
      if (Object.prototype.hasOwnProperty.call(anexosMap, userKey)) {
        const anexoInfo = anexosMap[userKey];
        
        // Buscamos el valor en la metadata usando la clave que viene del frontend (ej: disponeReporteNominas)
        const respuestaUsuario =
          (rawData[userKey] as string | undefined)?.toString() || '';

        // Lógica de "SI" / "NO" / "NO_APLICA"
        if (respuestaUsuario.toUpperCase() === 'SI') {
          processedData[anexoInfo.key] = anexoInfo.text;
        } else if (respuestaUsuario.toUpperCase() === 'NO') {
          processedData[anexoInfo.key] = `FALTA: ${anexoInfo.text || userKey}`;
        } else {
          // Caso vacío o NO_APLICA
          processedData[anexoInfo.key] = '';
        }
      }
    }

    // PASO 2: Eliminación de párrafos vacíos ({{Anexo_XX}})
    for (const key in processedData) {
      if (key.startsWith('Anexo_') && processedData[key] === '') {
        const regex = new RegExp(
          `<p[^>]*>\\s*{{${key}}}\\s*<\\/p>[\\r\\n]*`,
          'g',
        );
        htmlContent = htmlContent.replace(regex, '');
      }
    }

    // PASO 3: Reemplazo final de variables normales y anexos llenos
    for (const key in processedData) {
      // Evitamos procesar objetos anidados
      const value = processedData[key];
      if (typeof value === 'object' && value !== null) continue;

      const placeholder = new RegExp(`{{${key}}}`, 'g');
      let stringValue = '';
      
      if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
      ) {
        stringValue = String(value);
      }
      htmlContent = htmlContent.replace(placeholder, stringValue);
    }

    // PASO 4: Limpieza final de placeholders residuales
    htmlContent = htmlContent.replace(/{{[^}]+}}/g, '');

    return htmlContent;
  }
}