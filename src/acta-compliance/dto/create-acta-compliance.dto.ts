// src/acta-compliance/dto/create-acta-compliance.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';

// 1. Definimos el Enum con las únicas respuestas válidas
export enum RespuestaCompliance {
  SI = 'SI',
  NO = 'NO',
  NO_APLICA = 'NO_APLICA',
}

// Esta clase base define todos los campos que el usuario puede llenar
export class BaseActaComplianceDto {
  // --- Datos Generales ---
  @ApiProperty({ required: false, example: 'revisor@correo.com' })
  @IsOptional()
  @IsString()
  correo_electronico?: string;

  @ApiProperty({ required: false, example: 'G-0000000-0' })
  @IsOptional()
  @IsString()
  rif_organo_entidad?: string;

  @ApiProperty({ required: false, example: 'Pedro Pérez' })
  @IsOptional()
  @IsString()
  nombre_completo_revisor?: string;

  @ApiProperty({ required: false, example: 'Dirección' })
  @IsOptional()
  @IsString()
  denominacion_cargo?: string;

  @ApiProperty({ required: false, example: 'Ministerio de Actas Externas' })
  @IsOptional()
  @IsString()
  nombre_organo_entidad?: string;

  @ApiProperty({ required: false, example: 'Oficina de Auditoría' })
  @IsOptional()
  @IsString()
  nombre_unidad_revisora?: string;

  @ApiProperty({ required: false, example: '2025-10-29' })
  @IsOptional()
  @IsDateString()
  fecha_revision?: Date;

  @ApiProperty({ required: false, example: 'DOC-EXTERNO-001' })
  @IsOptional()
  @IsString()
  codigo_documento_revisado?: string;

  // --- Preguntas de Cumplimiento ---
  // Aceptan: 'SI', 'NO', 'NO_APLICA' o null

  // (q1 - q9)
  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q1_acta_contiene_lugar_suscripcion?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q2_acta_contiene_fecha_suscripcion?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q3_acta_identifica_organo_entregado?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q4_acta_identifica_servidor_entrega?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q5_acta_identifica_servidor_recibe?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q6_acta_describe_motivo_entrega?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q7_acta_describe_fundamento_legal?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q8_acta_contiene_relacion_anexos_normas?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q9_acta_expresa_integracion_anexos?: RespuestaCompliance;

  // (q10 - q19)
  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q10_acta_suscrita_por_quien_entrega?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q11_acta_suscrita_por_quien_recibe?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q12_anexa_informacion_adicional?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q13_anexos_con_fecha_corte_al_cese?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q14_acta_deja_constancia_inexistencia_info?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q15_acta_especifica_errores_omisiones?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q16_acta_elaborada_original_y_3_copias?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q17_incluye_autorizacion_certificar_copias?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q18_original_archivado_despacho_autoridad?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q19_copia_certificada_entregada_a_servidor_recibe?: RespuestaCompliance;

  // (q20 - q29)
  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q20_copia_certificada_entregada_a_servidor_entrega?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q21_copia_entregada_auditoria_interna_en_plazo?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q22_anexo_estado_cuentas_general?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q23_anexo_situacion_presupuestaria_detallada?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q24_anexo_gastos_comprometidos_no_causados?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q25_anexo_gastos_causados_no_pagados?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q26_anexo_estado_presupuestario_por_partidas?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q27_anexo_estado_presupuestario_por_cuentas?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q28_anexo_estados_financieros?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q29_anexo_balance_comprobacion_y_notas?: RespuestaCompliance;

  // (q30 - q39)
  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q30_anexo_estado_situacion_financiera_y_notas?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q31_anexo_estado_rendimiento_financiero_y_notas?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q32_anexo_estado_movimiento_patrimonio_y_notas?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q33_anexo_relacion_cuentas_por_cobrar?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q34_anexo_relacion_cuentas_por_pagar?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q35_anexo_relacion_fondos_terceros?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q36_anexo_situacion_fondos_anticipo?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q37_anexo_situacion_caja_chica?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q38_anexo_acta_arqueo_caja_chica?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q39_anexo_listado_registro_proveedores?: RespuestaCompliance;

  // (q40 - q49)
  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q40_anexo_reporte_libros_contables?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q41_anexo_reporte_cuentas_bancarias?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q42_anexo_reporte_conciliaciones_bancarias?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q43_anexo_reporte_retenciones_pendientes?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q44_anexo_reporte_contrataciones_publicas?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q45_anexo_reporte_fideicomiso_prestaciones?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q46_anexo_reporte_bonos_vacacionales?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q47_anexo_mencion_numero_cargos_rrhh?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q48_incluye_cuadro_resumen_cargos?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q49_cuadro_resumen_cargos_validado_rrhh?: RespuestaCompliance;

  // (q50 - q59)
  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q50_anexo_reporte_nominas?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q51_anexo_inventario_bienes?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q52_inventario_bienes_fecha_entrega?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q53_inventario_bienes_comprobado_fisicamente?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q54_verificada_existencia_bienes_inventario?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q55_verificada_condicion_bienes_inventario?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q56_inventario_indica_responsable_patrimonial?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q57_inventario_indica_responsable_uso?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q58_inventario_indica_fecha_verificacion?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q59_inventario_indica_numero_acta_verificacion?: RespuestaCompliance;

  // (q60 - q69)
  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q60_inventario_indica_numero_registro_bien?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q61_inventario_indica_codigo_bien?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q62_inventario_indica_descripcion_bien?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q63_inventario_indica_marca_bien?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q64_inventario_indica_modelo_bien?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q65_inventario_indica_serial_bien?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q66_inventario_indica_estado_conservacion_bien?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q67_inventario_indica_ubicacion_bien?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q68_inventario_indica_valor_mercado_bien?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q69_anexo_ejecucion_poa?: RespuestaCompliance;

  // (q70 - q79)
  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q70_incluye_ejecucion_poa_fecha_entrega?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q71_incluye_causas_incumplimiento_metas_poa?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q72_incluye_plan_operativo_anual?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q73_anexo_indice_general_archivo?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q74_archivo_indica_clasificacion?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q75_archivo_indica_ubicacion_fisica?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q76_incluye_relacion_montos_fondos_asignados?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q77_incluye_saldo_efectivo_fondos?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q78_incluye_relacion_bienes_asignados?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q79_incluye_relacion_bienes_unidad_bienes?: RespuestaCompliance;

  // (q80 - q89)
  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q80_incluye_estados_bancarios_conciliados?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q81_incluye_lista_comprobantes_gastos?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q82_incluye_cheques_pendientes_cobro?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q83_incluye_reporte_transferencias_bancarias?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q84_anexo_caucion_funcionario_admin?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q85_incluye_cuadro_liquidado_recaudado?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q86_incluye_relacion_expedientes_investigacion?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q87_incluye_situacion_tesoro_nacional?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q88_incluye_ejecucion_presupuesto_nacional?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q89_incluye_monto_deuda_publica_nacional?: RespuestaCompliance;

  // (q90 - q98)
  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q90_incluye_situacion_cuentas_nacion?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q91_incluye_situacion_tesoro_estadal?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q92_incluye_ejecucion_presupuesto_estadal?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q93_incluye_situacion_cuentas_estadal?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q94_incluye_situacion_tesoro_municipal?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q95_incluye_ejecucion_presupuesto_municipal?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q96_incluye_situacion_cuentas_municipal?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q97_incluye_inventario_terrenos_municipales?: RespuestaCompliance;

  @ApiProperty({ required: false, enum: RespuestaCompliance })
  @IsOptional()
  @IsEnum(RespuestaCompliance)
  q98_incluye_relacion_ingresos_venta_terrenos?: RespuestaCompliance;
}

export class CreateActaComplianceDto extends BaseActaComplianceDto {}
