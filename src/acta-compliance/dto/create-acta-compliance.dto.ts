// src/acta-compliance/dto/create-acta-compliance.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

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

  // --- Preguntas de Cumplimiento (Boolean?) ---
  // (q1 - q9)
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q1_acta_contiene_lugar_suscripcion?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q2_acta_contiene_fecha_suscripcion?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q3_acta_identifica_organo_entregado?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q4_acta_identifica_servidor_entrega?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q5_acta_identifica_servidor_recibe?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q6_acta_describe_motivo_entrega?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q7_acta_describe_fundamento_legal?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q8_acta_contiene_relacion_anexos_normas?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q9_acta_expresa_integracion_anexos?: boolean;
  // (q10 - q19)
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q10_acta_suscrita_por_quien_entrega?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q11_acta_suscrita_por_quien_recibe?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q12_anexa_informacion_adicional?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q13_anexos_con_fecha_corte_al_cese?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q14_acta_deja_constancia_inexistencia_info?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q15_acta_especifica_errores_omisiones?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q16_acta_elaborada_original_y_3_copias?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q17_incluye_autorizacion_certificar_copias?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q18_original_archivado_despacho_autoridad?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q19_copia_certificada_entregada_a_servidor_recibe?: boolean;
  // (q20 - q29)
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q20_copia_certificada_entregada_a_servidor_entrega?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q21_copia_entregada_auditoria_interna_en_plazo?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q22_anexo_estado_cuentas_general?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q23_anexo_situacion_presupuestaria_detallada?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q24_anexo_gastos_comprometidos_no_causados?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q25_anexo_gastos_causados_no_pagados?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q26_anexo_estado_presupuestario_por_partidas?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q27_anexo_estado_presupuestario_por_cuentas?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q28_anexo_estados_financieros?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q29_anexo_balance_comprobacion_y_notas?: boolean;
  // (q30 - q39)
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q30_anexo_estado_situacion_financiera_y_notas?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q31_anexo_estado_rendimiento_financiero_y_notas?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q32_anexo_estado_movimiento_patrimonio_y_notas?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q33_anexo_relacion_cuentas_por_cobrar?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q34_anexo_relacion_cuentas_por_pagar?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q35_anexo_relacion_fondos_terceros?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q36_anexo_situacion_fondos_anticipo?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q37_anexo_situacion_caja_chica?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q38_anexo_acta_arqueo_caja_chica?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q39_anexo_listado_registro_proveedores?: boolean;
  // (q40 - q49)
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q40_anexo_reporte_libros_contables?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q41_anexo_reporte_cuentas_bancarias?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q42_anexo_reporte_conciliaciones_bancarias?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q43_anexo_reporte_retenciones_pendientes?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q44_anexo_reporte_contrataciones_publicas?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q45_anexo_reporte_fideicomiso_prestaciones?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q46_anexo_reporte_bonos_vacacionales?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q47_anexo_mencion_numero_cargos_rrhh?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q48_incluye_cuadro_resumen_cargos?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q49_cuadro_resumen_cargos_validado_rrhh?: boolean;
  // (q50 - q59)
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q50_anexo_reporte_nominas?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q51_anexo_inventario_bienes?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q52_inventario_bienes_fecha_entrega?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q53_inventario_bienes_comprobado_fisicamente?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q54_verificada_existencia_bienes_inventario?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q55_verificada_condicion_bienes_inventario?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q56_inventario_indica_responsable_patrimonial?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q57_inventario_indica_responsable_uso?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q58_inventario_indica_fecha_verificacion?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q59_inventario_indica_numero_acta_verificacion?: boolean;
  // (q60 - q69)
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q60_inventario_indica_numero_registro_bien?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q61_inventario_indica_codigo_bien?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q62_inventario_indica_descripcion_bien?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q63_inventario_indica_marca_bien?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q64_inventario_indica_modelo_bien?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q65_inventario_indica_serial_bien?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q66_inventario_indica_estado_conservacion_bien?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q67_inventario_indica_ubicacion_bien?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q68_inventario_indica_valor_mercado_bien?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q69_anexo_ejecucion_poa?: boolean;
  // (q70 - q79)
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q70_incluye_ejecucion_poa_fecha_entrega?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q71_incluye_causas_incumplimiento_metas_poa?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q72_incluye_plan_operativo_anual?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q73_anexo_indice_general_archivo?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q74_archivo_indica_clasificacion?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q75_archivo_indica_ubicacion_fisica?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q76_incluye_relacion_montos_fondos_asignados?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q77_incluye_saldo_efectivo_fondos?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q78_incluye_relacion_bienes_asignados?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q79_incluye_relacion_bienes_unidad_bienes?: boolean;
  // (q80 - q89)
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q80_incluye_estados_bancarios_conciliados?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q81_incluye_lista_comprobantes_gastos?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q82_incluye_cheques_pendientes_cobro?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q83_incluye_reporte_transferencias_bancarias?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q84_anexo_caucion_funcionario_admin?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q85_incluye_cuadro_liquidado_recaudado?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q86_incluye_relacion_expedientes_investigacion?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q87_incluye_situacion_tesoro_nacional?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q88_incluye_ejecucion_presupuesto_nacional?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q89_incluye_monto_deuda_publica_nacional?: boolean;
  // (q90 - q98)
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q90_incluye_situacion_cuentas_nacion?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q91_incluye_situacion_tesoro_estadal?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q92_incluye_ejecucion_presupuesto_estadal?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q93_incluye_situacion_cuentas_estadal?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q94_incluye_situacion_tesoro_municipal?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q95_incluye_ejecucion_presupuesto_municipal?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q96_incluye_situacion_cuentas_municipal?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q97_incluye_inventario_terrenos_municipales?: boolean;
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  q98_incluye_relacion_ingresos_venta_terrenos?: boolean;
}

// El DTO para Crear un checklist (Hereda todo y no añade nada, ya que el userId vendrá del token)
export class CreateActaComplianceDto extends BaseActaComplianceDto {
  // Ya no necesitamos 'actaId' aquí, lo obtendremos del usuario autenticado
}
