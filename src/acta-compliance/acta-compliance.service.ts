// src/acta-compliance/acta-compliance.service.ts

import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, User } from '@prisma/client';
import * as puppeteer from 'puppeteer';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
// Importa los DTOs
import { CreateActaComplianceDto } from './dto/create-acta-compliance.dto';
import { UpdateActaComplianceDto } from './dto/update-acta-compliance.dto';
// Importa las constantes que usará la nueva función de HTML
import { DB_KEYS_MAP, FINDINGS_MAP } from './acta-compliance.constants';

@Injectable()
export class ActaComplianceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Crea un nuevo registro de cumplimiento (checklist)
   */
  async create(createActaComplianceDto: CreateActaComplianceDto, user: User) {
    const userId = user.id;

    // Calcula el puntaje y resumen
    const puntaje = this.calculateScore(createActaComplianceDto);
    const resumen = this.generateSummary(puntaje);

    try {
      const newCompliance = await this.prisma.actaCompliance.create({
        data: {
          ...createActaComplianceDto,
          puntajeCalculado: puntaje,
          resumenCumplimiento: resumen,
          userId: userId,
        },
      });
      return newCompliance;
    } catch (error) {
      console.error('Error al crear el registro de compliance:', error);
      throw new InternalServerErrorException(
        'No se pudo crear el registro de cumplimiento.',
      );
    }
  }

  /**
   * Obtiene todos los checklists del usuario logueado
   */
  async findAllForUser(user: User) {
    return this.prisma.actaCompliance.findMany({
      where: { userId: user.id },
    });
  }

  /**
   * Obtiene un checklist específico, verificando propiedad
   */
  async findOneForUser(id: string, user: User) {
    const compliance = await this.prisma.actaCompliance.findUnique({
      where: { id },
    });

    if (!compliance) {
      throw new NotFoundException('Registro de cumplimiento no encontrado.');
    }

    this.checkOwnership(compliance, user.id);
    return compliance;
  }

  /**
   * Actualiza un checklist, recalculando el puntaje
   */
  async update(
    id: string,
    updateActaComplianceDto: UpdateActaComplianceDto,
    user: User,
  ) {
    // Primero, asegura que el usuario sea el dueño
    const currentCompliance = await this.findOneForUser(id, user);

    // Recalcula el puntaje y resumen si los datos de preguntas cambiaron
    const dataToUpdate: Prisma.ActaComplianceUpdateInput = {
      ...updateActaComplianceDto,
    };

    // Crea un DTO temporal para recalcular (fusionando datos antiguos y nuevos)
    const dtoForCalculation = {
      ...currentCompliance,
      ...updateActaComplianceDto,
    } as CreateActaComplianceDto;

    const puntaje = this.calculateScore(dtoForCalculation);
    const resumen = this.generateSummary(puntaje);
    dataToUpdate.puntajeCalculado = puntaje;
    dataToUpdate.resumenCumplimiento = resumen;

    return this.prisma.actaCompliance.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  /**
   * Elimina un checklist
   */
  async remove(id: string, user: User) {
    await this.findOneForUser(id, user); // Verifica propiedad
    return this.prisma.actaCompliance.delete({ where: { id } });
  }

  // --- GENERACIÓN DE PDF ---

  /**
   * Genera el buffer del PDF para un checklist específico
   */
  async generatePdfBuffer(id: string, user: User): Promise<Buffer> {
    const complianceData = await this.findOneForUser(id, user);

    // Genera el contenido HTML
    const htmlContent = this.generateHtmlContent(
      complianceData as unknown as CreateActaComplianceDto,
      complianceData.puntajeCalculado ?? 0,
      complianceData.resumenCumplimiento ?? '',
    );

    let browser: puppeteer.Browser | undefined;
    try {
      // Configuración de Puppeteer
      browser = await puppeteer.launch({
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
        ],
        headless: true,
      });

      const page: puppeteer.Page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
      });

      return Buffer.from(pdfBuffer);
    } catch (error) {
      console.error('Error al generar el PDF con Puppeteer:', error);
      throw new InternalServerErrorException(
        'No se pudo generar el reporte PDF.',
      );
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  /**
   * Envía el PDF generado por correo electrónico
   */
  async sendPdfByEmail(id: string, user: User) {
    try {
      const pdfBuffer = await this.generatePdfBuffer(id, user);
      const complianceData = await this.findOneForUser(id, user);

      const fileName = `Reporte_Compliance_${
        complianceData.nombre_organo_entidad
      }_${new Date(
        complianceData.fecha_revision || Date.now(),
      ).toLocaleDateString('es-VE')}.pdf`;
      const reportDate = new Date(
        complianceData.fecha_revision || Date.now(),
      ).toLocaleDateString('es-VE');

      await this.emailService.sendReportWithAttachment(
        user.email,
        pdfBuffer,
        fileName,
        user.nombre,
        reportDate,
      );

      return {
        message: 'Reporte enviado exitosamente a tu correo electrónico.',
      };
    } catch (error) {
      console.error('Error al enviar el PDF por correo:', error);
      throw new InternalServerErrorException(
        'No se pudo enviar el reporte por correo.',
      );
    }
  }

  // --- LÓGICA DE NEGOCIO ---

  /**
   * Helper para verificar propiedad del registro
   */
  private checkOwnership(
    compliance: { userId: string } | null,
    userId: string,
  ) {
    if (!compliance) {
      throw new NotFoundException('Registro no encontrado');
    }
    if (compliance.userId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para acceder a este registro',
      );
    }
  }

  // --- LÓGICA DE CÁLCULO ---

  private getPonderaciones(): Record<keyof CreateActaComplianceDto, number> {
    return {
      correo_electronico: 0,
      rif_organo_entidad: 0,
      nombre_completo_revisor: 0,
      denominacion_cargo: 0,
      nombre_organo_entidad: 0,
      nombre_unidad_revisora: 0,
      fecha_revision: 0,
      codigo_documento_revisado: 0,
      q1_acta_contiene_lugar_suscripcion: 1,
      q2_acta_contiene_fecha_suscripcion: 1,
      q3_acta_identifica_organo_entregado: 1,
      q4_acta_identifica_servidor_entrega: 1,
      q5_acta_identifica_servidor_recibe: 1,
      q6_acta_describe_motivo_entrega: 1,
      q7_acta_describe_fundamento_legal: 1,
      q8_acta_contiene_relacion_anexos_normas: 1,
      q9_acta_expresa_integracion_anexos: 1,
      q10_acta_suscrita_por_quien_entrega: 2,
      q11_acta_suscrita_por_quien_recibe: 2,
      q12_anexa_informacion_adicional: 2,
      q13_anexos_con_fecha_corte_al_cese: 1,
      q14_acta_deja_constancia_inexistencia_info: 2,
      q15_acta_especifica_errores_omisiones: 2,
      q16_acta_elaborada_original_y_3_copias: 2,
      q17_incluye_autorizacion_certificar_copias: 1,
      q18_original_archivado_despacho_autoridad: 1,
      q19_copia_certificada_entregada_a_servidor_recibe: 1,
      q20_copia_certificada_entregada_a_servidor_entrega: 1,
      q21_copia_entregada_auditoria_interna_en_plazo: 0,
      q22_anexo_estado_cuentas_general: 1,
      q23_anexo_situacion_presupuestaria_detallada: 2,
      q24_anexo_gastos_comprometidos_no_causados: 0,
      q25_anexo_gastos_causados_no_pagados: 2,
      q26_anexo_estado_presupuestario_por_partidas: 2,
      q27_anexo_estado_presupuestario_por_cuentas: 2,
      q28_anexo_estados_financieros: 1,
      q29_anexo_balance_comprobacion_y_notas: 1.3,
      q30_anexo_estado_situacion_financiera_y_notas: 1.31,
      q31_anexo_estado_rendimiento_financiero_y_notas: 1.32,
      q32_anexo_estado_movimiento_patrimonio_y_notas: 1.33,
      q33_anexo_relacion_cuentas_por_cobrar: 1.34,
      q34_anexo_relacion_cuentas_por_pagar: 1.35,
      q35_anexo_relacion_fondos_terceros: 1.36,
      q36_anexo_situacion_fondos_anticipo: 1.37,
      q37_anexo_situacion_caja_chica: 1.38,
      q38_anexo_acta_arqueo_caja_chica: 1.39,
      q39_anexo_listado_registro_proveedores: 1.4,
      q40_anexo_reporte_libros_contables: 1.41,
      q41_anexo_reporte_cuentas_bancarias: 1.42,
      q42_anexo_reporte_conciliaciones_bancarias: 1.43,
      q43_anexo_reporte_retenciones_pendientes: 1.44,
      q44_anexo_reporte_contrataciones_publicas: 1.45,
      q45_anexo_reporte_fideicomiso_prestaciones: 1.46,
      q46_anexo_reporte_bonos_vacacionales: 1.47,
      q47_anexo_mencion_numero_cargos_rrhh: 1.48,
      q48_incluye_cuadro_resumen_cargos: 1.49,
      q49_cuadro_resumen_cargos_validado_rrhh: 1.5,
      q50_anexo_reporte_nominas: 1.51,
      q51_anexo_inventario_bienes: 1.52,
      q52_inventario_bienes_fecha_entrega: 1.53,
      q53_inventario_bienes_comprobado_fisicamente: 1.54,
      q54_verificada_existencia_bienes_inventario: 1.55,
      q55_verificada_condicion_bienes_inventario: 1.56,
      q56_inventario_indica_responsable_patrimonial: 1.57,
      q57_inventario_indica_responsable_uso: 1.58,
      q58_inventario_indica_fecha_verificacion: 1.59,
      q59_inventario_indica_numero_acta_verificacion: 1.6,
      q60_inventario_indica_numero_registro_bien: 1.61,
      q61_inventario_indica_codigo_bien: 1.62,
      q62_inventario_indica_descripcion_bien: 1.63,
      q63_inventario_indica_marca_bien: 1.64,
      q64_inventario_indica_modelo_bien: 1.65,
      q65_inventario_indica_serial_bien: 1.66,
      q66_inventario_indica_estado_conservacion_bien: 1.67,
      q67_inventario_indica_ubicacion_bien: 1.68,
      q68_inventario_indica_valor_mercado_bien: 1.69,
      q69_anexo_ejecucion_poa: 1.7,
      q70_incluye_ejecucion_poa_fecha_entrega: 1.71,
      q71_incluye_causas_incumplimiento_metas_poa: 1.72,
      q72_incluye_plan_operativo_anual: 1.73,
      q73_anexo_indice_general_archivo: 1.74,
      q74_archivo_indica_clasificacion: 1.75,
      q75_archivo_indica_ubicacion_fisica: 1.76,
      q76_incluye_relacion_montos_fondos_asignados: 0,
      q77_incluye_saldo_efectivo_fondos: 0,
      q78_incluye_relacion_bienes_asignados: 0,
      q79_incluye_relacion_bienes_unidad_bienes: 0,
      q80_incluye_estados_bancarios_conciliados: 0,
      q81_incluye_lista_comprobantes_gastos: 0,
      q82_incluye_cheques_pendientes_cobro: 0,
      q83_incluye_reporte_transferencias_bancarias: 0,
      q84_anexo_caucion_funcionario_admin: 0,
      q85_incluye_cuadro_liquidado_recaudado: 0,
      q86_incluye_relacion_expedientes_investigacion: 0,
      q87_incluye_situacion_tesoro_nacional: 0,
      q88_incluye_ejecucion_presupuesto_nacional: 0,
      q89_incluye_monto_deuda_publica_nacional: 0,
      q90_incluye_situacion_cuentas_nacion: 0,
      q91_incluye_situacion_tesoro_estadal: 0,
      q92_incluye_ejecucion_presupuesto_estadal: 0,
      q93_incluye_situacion_cuentas_estadal: 0,
      q94_incluye_situacion_tesoro_municipal: 0,
      q95_incluye_ejecucion_presupuesto_municipal: 0,
      q96_incluye_situacion_cuentas_municipal: 0,
      q97_incluye_inventario_terrenos_municipales: 0,
      q98_incluye_relacion_ingresos_venta_terrenos: 0,
    };
  }

  private calculateScore(dto: CreateActaComplianceDto): number {
    const ponderaciones = this.getPonderaciones();
    let totalPonderacion = 0;
    let puntajeObtenido = 0;

    for (const key of DB_KEYS_MAP) {
      const typedKey = key as keyof CreateActaComplianceDto;
      const ponderacion = ponderaciones[typedKey] || 0;
      totalPonderacion += ponderacion;

      if (dto[typedKey] === true) {
        puntajeObtenido += ponderacion;
      }
    }

    if (totalPonderacion === 0) return 0;
    return (puntajeObtenido / totalPonderacion) * 100;
  }

  private generateSummary(score: number): string {
    if (score >= 90) return 'Nivel Alto o Crítico';
    if (score >= 75) return 'Nivel Intermedio';
    if (score >= 50) return 'Nivel Bajo';
    return 'Nivel Muy Bajo';
  }

  // ---
  // --- NUEVA FUNCIÓN DE GENERACIÓN DE HTML ---
  // ---
  /**
   * Genera el contenido HTML basado en la plantilla de reporte (CÓDIGO AUDITORIA)
   *
   */
  private generateHtmlContent(
    createDto: CreateActaComplianceDto,
    puntaje: number,
    resumen: string,
  ): string {
    let html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #999; padding: 6px; text-align: left; font-size: 10px; word-wrap: break-word; }
            th { background-color: #f0f0f0; font-weight: bold; }
            .header-table { margin-bottom: 20px; }
            .header-table td { font-weight: bold; background-color: #f9f9f9; }
            .main-table th { background-color: #e0e0e0; text-align: center; }
            .cumple-si { color: green; font-weight: bold; text-align: center; }
            .cumple-no { color: red; font-weight: bold; text-align: center; }
            .col-numero { width: 5%; text-align: center; }
            .col-busqueda { width: 35%; }
            .col-cumple { width: 8%; text-align: center; }
            .col-condicion { width: 26%; }
            .col-criterio { width: 26%; }
            h2 { text-align: center; color: #000; }
            h3 { margin-top: 25px; }
          </style>
        </head>
        <body>
          <h2>REGISTRO DE HALLAZGOS U OBSERVACIONES<br>ACTA DE ENTREGA</h2>
          
          <table class="header-table">
            <tr>
              <td>ENTE U ORGANISMO:</td>
              <td>${createDto.nombre_organo_entidad || ''}</td>
              <td>UNIDAD REVISORA:</td>
              <td>${createDto.nombre_unidad_revisora || ''}</td>
            </tr>
            <tr>
              <td>CÓDIGO:</td>
              <td>${createDto.codigo_documento_revisado || ''}</td>
              <td>ELABORADO POR:</td>
              <td>${createDto.nombre_completo_revisor || ''}</td>
            </tr>
            <tr>
              <td>REVISADO POR:</td>
              <td>${createDto.nombre_completo_revisor || ''}</td>
              <td>FECHA:</td>
              <td>${new Date(
                createDto.fecha_revision || Date.now(),
              ).toLocaleDateString('es-VE')}</td>
            </tr>
          </table>

          <table class="main-table">
            <thead>
              <tr>
                <th class="col-numero">Nº</th>
                <th class="col-busqueda">BÚSQUEDA</th>
                <th class="col-cumple">CUMPLE</th>
                <th class="col-condicion">CONDICIÓN</th>
                <th class="col-criterio">CRITERIO</th>
              </tr>
            </thead>
            <tbody>
    `;

    // Iterar sobre todas las preguntas del DTO
    DB_KEYS_MAP.forEach((dtoKey, index) => {
      const findingInfo = FINDINGS_MAP[dtoKey];
      const pregunta = findingInfo
        ? findingInfo.pregunta
        : 'Pregunta no encontrada';
      const cumple = createDto[dtoKey] === true;

      const cumpleText = cumple ? 'SI' : 'NO';
      const cumpleClass = cumple ? 'cumple-si' : 'cumple-no';
      // Solo mostrar condición y criterio si la respuesta es NO
      const condicion = !cumple && findingInfo ? findingInfo.condicion : '';
      const criterio = !cumple && findingInfo ? findingInfo.criterio : '';

      html += `
              <tr>
                <td class="col-numero">${index + 1}</td>
                <td class="col-busqueda">${pregunta}</td>
                <td class="${cumpleClass}">${cumpleText}</td>
                <td class="col-condicion">${condicion}</td>
                <td class="col-criterio">${criterio}</td>
              </tr>
      `;
    });

    html += `
            </tbody>
          </table>
          
          <h3 style="margin-top: 20px;">Resultados de la Auditoría</h3>
          <p><strong>Puntaje Calculado:</strong> ${puntaje.toFixed(2)}%</p>
          <p><strong>Resumen de Cumplimiento:</strong> ${resumen}</p>
          
        </body>
      </html>
    `;

    return html;
  }
}
