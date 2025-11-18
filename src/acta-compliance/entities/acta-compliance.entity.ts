// src/acta-compliance/entities/acta-compliance.entity.ts

import { ApiProperty } from '@nestjs/swagger';
import { ActaCompliance as ActaCompliancePrisma } from '@prisma/client';
import { RespuestaCompliance } from '../dto/create-acta-compliance.dto';

export class ActaCompliance implements ActaCompliancePrisma {
  @ApiProperty({ example: 'uuid-v4-string' })
  id: string;

  @ApiProperty({ example: 'uuid-user-id' })
  userId: string;

  // --- Datos Generales ---
  @ApiProperty({ required: false, nullable: true })
  correo_electronico: string | null;
  @ApiProperty({ required: false, nullable: true })
  rif_organo_entidad: string | null;
  @ApiProperty({ required: false, nullable: true })
  nombre_completo_revisor: string | null;
  @ApiProperty({ required: false, nullable: true })
  denominacion_cargo: string | null;
  @ApiProperty({ required: false, nullable: true })
  nombre_organo_entidad: string | null;
  @ApiProperty({ required: false, nullable: true })
  nombre_unidad_revisora: string | null;
  @ApiProperty({ required: false, nullable: true })
  fecha_revision: Date | null;
  @ApiProperty({ required: false, nullable: true })
  codigo_documento_revisado: string | null;

  // --- Preguntas (Ejemplo genérico y mapeo completo) ---
  @ApiProperty({ enum: RespuestaCompliance, nullable: true })
  q1_acta_contiene_lugar_suscripcion: string | null;

  @ApiProperty({ enum: RespuestaCompliance, nullable: true })
  q2_acta_contiene_fecha_suscripcion: string | null;

  @ApiProperty({ nullable: true })
  q3_acta_identifica_organo_entregado: string | null;
  @ApiProperty({ nullable: true })
  q4_acta_identifica_servidor_entrega: string | null;
  @ApiProperty({ nullable: true })
  q5_acta_identifica_servidor_recibe: string | null;
  @ApiProperty({ nullable: true })
  q6_acta_describe_motivo_entrega: string | null;
  @ApiProperty({ nullable: true })
  q7_acta_describe_fundamento_legal: string | null;
  @ApiProperty({ nullable: true })
  q8_acta_contiene_relacion_anexos_normas: string | null;
  @ApiProperty({ nullable: true })
  q9_acta_expresa_integracion_anexos: string | null;
  @ApiProperty({ nullable: true })
  q10_acta_suscrita_por_quien_entrega: string | null;
  @ApiProperty({ nullable: true })
  q11_acta_suscrita_por_quien_recibe: string | null;
  @ApiProperty({ nullable: true })
  q12_anexa_informacion_adicional: string | null;
  @ApiProperty({ nullable: true })
  q13_anexos_con_fecha_corte_al_cese: string | null;
  @ApiProperty({ nullable: true })
  q14_acta_deja_constancia_inexistencia_info: string | null;
  @ApiProperty({ nullable: true })
  q15_acta_especifica_errores_omisiones: string | null;
  @ApiProperty({ nullable: true })
  q16_acta_elaborada_original_y_3_copias: string | null;
  @ApiProperty({ nullable: true })
  q17_incluye_autorizacion_certificar_copias: string | null;
  @ApiProperty({ nullable: true })
  q18_original_archivado_despacho_autoridad: string | null;
  @ApiProperty({ nullable: true })
  q19_copia_certificada_entregada_a_servidor_recibe: string | null;
  @ApiProperty({ nullable: true })
  q20_copia_certificada_entregada_a_servidor_entrega: string | null;
  @ApiProperty({ nullable: true })
  q21_copia_entregada_auditoria_interna_en_plazo: string | null;
  @ApiProperty({ nullable: true })
  q22_anexo_estado_cuentas_general: string | null;
  @ApiProperty({ nullable: true })
  q23_anexo_situacion_presupuestaria_detallada: string | null;
  @ApiProperty({ nullable: true })
  q24_anexo_gastos_comprometidos_no_causados: string | null;
  @ApiProperty({ nullable: true })
  q25_anexo_gastos_causados_no_pagados: string | null;
  @ApiProperty({ nullable: true })
  q26_anexo_estado_presupuestario_por_partidas: string | null;
  @ApiProperty({ nullable: true })
  q27_anexo_estado_presupuestario_por_cuentas: string | null;
  @ApiProperty({ nullable: true })
  q28_anexo_estados_financieros: string | null;
  @ApiProperty({ nullable: true })
  q29_anexo_balance_comprobacion_y_notas: string | null;
  @ApiProperty({ nullable: true })
  q30_anexo_estado_situacion_financiera_y_notas: string | null;
  @ApiProperty({ nullable: true })
  q31_anexo_estado_rendimiento_financiero_y_notas: string | null;
  @ApiProperty({ nullable: true })
  q32_anexo_estado_movimiento_patrimonio_y_notas: string | null;
  @ApiProperty({ nullable: true })
  q33_anexo_relacion_cuentas_por_cobrar: string | null;
  @ApiProperty({ nullable: true })
  q34_anexo_relacion_cuentas_por_pagar: string | null;
  @ApiProperty({ nullable: true })
  q35_anexo_relacion_fondos_terceros: string | null;
  @ApiProperty({ nullable: true })
  q36_anexo_situacion_fondos_anticipo: string | null;
  @ApiProperty({ nullable: true })
  q37_anexo_situacion_caja_chica: string | null;
  @ApiProperty({ nullable: true })
  q38_anexo_acta_arqueo_caja_chica: string | null;
  @ApiProperty({ nullable: true })
  q39_anexo_listado_registro_proveedores: string | null;
  @ApiProperty({ nullable: true })
  q40_anexo_reporte_libros_contables: string | null;
  @ApiProperty({ nullable: true })
  q41_anexo_reporte_cuentas_bancarias: string | null;
  @ApiProperty({ nullable: true })
  q42_anexo_reporte_conciliaciones_bancarias: string | null;
  @ApiProperty({ nullable: true })
  q43_anexo_reporte_retenciones_pendientes: string | null;
  @ApiProperty({ nullable: true })
  q44_anexo_reporte_contrataciones_publicas: string | null;
  @ApiProperty({ nullable: true })
  q45_anexo_reporte_fideicomiso_prestaciones: string | null;
  @ApiProperty({ nullable: true })
  q46_anexo_reporte_bonos_vacacionales: string | null;
  @ApiProperty({ nullable: true })
  q47_anexo_mencion_numero_cargos_rrhh: string | null;
  @ApiProperty({ nullable: true })
  q48_incluye_cuadro_resumen_cargos: string | null;
  @ApiProperty({ nullable: true })
  q49_cuadro_resumen_cargos_validado_rrhh: string | null;
  @ApiProperty({ nullable: true })
  q50_anexo_reporte_nominas: string | null;
  @ApiProperty({ nullable: true })
  q51_anexo_inventario_bienes: string | null;
  @ApiProperty({ nullable: true })
  q52_inventario_bienes_fecha_entrega: string | null;
  @ApiProperty({ nullable: true })
  q53_inventario_bienes_comprobado_fisicamente: string | null;
  @ApiProperty({ nullable: true })
  q54_verificada_existencia_bienes_inventario: string | null;
  @ApiProperty({ nullable: true })
  q55_verificada_condicion_bienes_inventario: string | null;
  @ApiProperty({ nullable: true })
  q56_inventario_indica_responsable_patrimonial: string | null;
  @ApiProperty({ nullable: true })
  q57_inventario_indica_responsable_uso: string | null;
  @ApiProperty({ nullable: true })
  q58_inventario_indica_fecha_verificacion: string | null;
  @ApiProperty({ nullable: true })
  q59_inventario_indica_numero_acta_verificacion: string | null;
  @ApiProperty({ nullable: true })
  q60_inventario_indica_numero_registro_bien: string | null;
  @ApiProperty({ nullable: true })
  q61_inventario_indica_codigo_bien: string | null;
  @ApiProperty({ nullable: true })
  q62_inventario_indica_descripcion_bien: string | null;
  @ApiProperty({ nullable: true })
  q63_inventario_indica_marca_bien: string | null;
  @ApiProperty({ nullable: true })
  q64_inventario_indica_modelo_bien: string | null;
  @ApiProperty({ nullable: true })
  q65_inventario_indica_serial_bien: string | null;
  @ApiProperty({ nullable: true })
  q66_inventario_indica_estado_conservacion_bien: string | null;
  @ApiProperty({ nullable: true })
  q67_inventario_indica_ubicacion_bien: string | null;
  @ApiProperty({ nullable: true })
  q68_inventario_indica_valor_mercado_bien: string | null;
  @ApiProperty({ nullable: true })
  q69_anexo_ejecucion_poa: string | null;
  @ApiProperty({ nullable: true })
  q70_incluye_ejecucion_poa_fecha_entrega: string | null;
  @ApiProperty({ nullable: true })
  q71_incluye_causas_incumplimiento_metas_poa: string | null;
  @ApiProperty({ nullable: true })
  q72_incluye_plan_operativo_anual: string | null;
  @ApiProperty({ nullable: true })
  q73_anexo_indice_general_archivo: string | null;
  @ApiProperty({ nullable: true })
  q74_archivo_indica_clasificacion: string | null;
  @ApiProperty({ nullable: true })
  q75_archivo_indica_ubicacion_fisica: string | null;
  @ApiProperty({ nullable: true })
  q76_incluye_relacion_montos_fondos_asignados: string | null;
  @ApiProperty({ nullable: true })
  q77_incluye_saldo_efectivo_fondos: string | null;
  @ApiProperty({ nullable: true })
  q78_incluye_relacion_bienes_asignados: string | null;
  @ApiProperty({ nullable: true })
  q79_incluye_relacion_bienes_unidad_bienes: string | null;
  @ApiProperty({ nullable: true })
  q80_incluye_estados_bancarios_conciliados: string | null;
  @ApiProperty({ nullable: true })
  q81_incluye_lista_comprobantes_gastos: string | null;
  @ApiProperty({ nullable: true })
  q82_incluye_cheques_pendientes_cobro: string | null;
  @ApiProperty({ nullable: true })
  q83_incluye_reporte_transferencias_bancarias: string | null;
  @ApiProperty({ nullable: true })
  q84_anexo_caucion_funcionario_admin: string | null;
  @ApiProperty({ nullable: true })
  q85_incluye_cuadro_liquidado_recaudado: string | null;
  @ApiProperty({ nullable: true })
  q86_incluye_relacion_expedientes_investigacion: string | null;
  @ApiProperty({ nullable: true })
  q87_incluye_situacion_tesoro_nacional: string | null;
  @ApiProperty({ nullable: true })
  q88_incluye_ejecucion_presupuesto_nacional: string | null;
  @ApiProperty({ nullable: true })
  q89_incluye_monto_deuda_publica_nacional: string | null;
  @ApiProperty({ nullable: true })
  q90_incluye_situacion_cuentas_nacion: string | null;
  @ApiProperty({ nullable: true })
  q91_incluye_situacion_tesoro_estadal: string | null;
  @ApiProperty({ nullable: true })
  q92_incluye_ejecucion_presupuesto_estadal: string | null;
  @ApiProperty({ nullable: true })
  q93_incluye_situacion_cuentas_estadal: string | null;
  @ApiProperty({ nullable: true })
  q94_incluye_situacion_tesoro_municipal: string | null;
  @ApiProperty({ nullable: true })
  q95_incluye_ejecucion_presupuesto_municipal: string | null;
  @ApiProperty({ nullable: true })
  q96_incluye_situacion_cuentas_municipal: string | null;
  @ApiProperty({ nullable: true })
  q97_incluye_inventario_terrenos_municipales: string | null;
  @ApiProperty({ nullable: true })
  q98_incluye_relacion_ingresos_venta_terrenos: string | null;

  // --- Resultados ---
  @ApiProperty({ example: 85.5, nullable: true })
  puntajeCalculado: number | null;

  @ApiProperty({ example: 'Nivel Bajo', nullable: true })
  resumenCumplimiento: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
