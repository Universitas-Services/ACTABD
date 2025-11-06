// src/acta-compliance/acta-compliance.constants.ts
import { ActaCompliance } from '@prisma/client';

// Define cómo se ve un "Hallazgo"
interface FindingData {
  pregunta: string;
  condicion: string;
  criterio: string;
  observacionHtml: string; // El texto para el anexo de observaciones
}

// 1. MAPA DE HALLAZGOS (Datos para cuando la respuesta es "NO")
// La "key" debe ser idéntica al nombre del campo en tu schema.prisma
export const FINDINGS_MAP: Record<string, FindingData> = {
  q1_acta_contiene_lugar_suscripcion: {
    pregunta: '¿El acta contiene el lugar de la suscripción?',
    condicion: 'SE EVIDENCIÓ QUE NO CONTIENE EL LUGAR DE SUSCRIPCIÓN',
    criterio: 'ARTÍCULO 10.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
    observacionHtml:
      '<b>¿El acta contiene el lugar de la suscripción?</b>\n' +
      '<b>Hallazgo:</b> Se evidenció que no contiene lugar de suscripción.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 10.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q2_acta_contiene_fecha_suscripcion: {
    pregunta: '¿El acta contiene fecha de la suscripción?',
    condicion: 'SE EVIDENCIÓ QUE NO CONTIENE LA FECHA DE SUSCRIPCIÓN',
    criterio: 'ARTÍCULO 10.2 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
    observacionHtml:
      '<b>¿El acta contiene fecha de la suscripción?</b>\n' +
      '<b>Hallazgo:</b> Se evidenció que no contiene la fecha de suscripción.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 10.2 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q3_acta_identifica_organo_entregado: {
    pregunta:
      '¿El acta contiene la identificación del órgano, entidad, oficina o dependencia que se entrega?',
    condicion: 'SE EVIDENCIÓ QUE NO CONTIENE LA IDENTIFICACIÓN',
    criterio: 'ARTÍCULO 10.3 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
    observacionHtml:
      '<b>¿El acta contiene la identificación del órgano...?</b>\n' +
      '<b>Hallazgo:</b> Se evidenció que no contiene la identificación.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 10.3...',
  },

  // ...
  // ¡¡ACCIÓN REQUERIDA!!: Debes rellenar este mapa con tus 98 preguntas
  // ...

  q98_incluye_relacion_ingresos_venta_terrenos: {
    pregunta:
      '¿Se incluye Relación de Ingresos producto de las ventas de terrenos ejidos o terrenos propios distritales o municipales?',
    condicion: 'SE EVIDENCIÓ QUE NO INCLUYE RELACIÓN DE INGRESOS POR VENTAS',
    criterio: 'ARTÍCULO 17.6 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
    observacionHtml:
      '<b>¿Se incluye Relación de Ingresos producto de las ventas de terrenos...?</b>\n' +
      '<b>Hallazgo:</b> Se evidenció que no se incluye la relación.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 17.6...',
  },
};

// 2. MAPA DE CLAVES DE BD (Mapea el orden (índice) al nombre de la clave en la BD)
// (Basado en tu schema.prisma)
export const DB_KEYS_MAP: (keyof ActaCompliance)[] = [
  'q1_acta_contiene_lugar_suscripcion',
  'q2_acta_contiene_fecha_suscripcion',
  'q3_acta_identifica_organo_entregado',
  'q4_acta_identifica_servidor_entrega',
  'q5_acta_identifica_servidor_recibe',
  'q6_acta_describe_motivo_entrega',
  'q7_acta_describe_fundamento_legal',
  'q8_acta_contiene_relacion_anexos_normas',
  'q9_acta_expresa_integracion_anexos',
  'q10_acta_suscrita_por_quien_entrega',
  'q11_acta_suscrita_por_quien_recibe',
  'q12_anexa_informacion_adicional',
  'q13_anexos_con_fecha_corte_al_cese',
  'q14_acta_deja_constancia_inexistencia_info',
  'q15_acta_especifica_errores_omisiones',
  'q16_acta_elaborada_original_y_3_copias',
  'q17_incluye_autorizacion_certificar_copias',
  'q18_original_archivado_despacho_autoridad',
  'q19_copia_certificada_entregada_a_servidor_recibe',
  'q20_copia_certificada_entregada_a_servidor_entrega',
  'q21_copia_entregada_auditoria_interna_en_plazo',
  'q22_anexo_estado_cuentas_general',
  'q23_anexo_situacion_presupuestaria_detallada',
  'q24_anexo_gastos_comprometidos_no_causados',
  'q25_anexo_gastos_causados_no_pagados',
  'q26_anexo_estado_presupuestario_por_partidas',
  'q27_anexo_estado_presupuestario_por_cuentas',
  'q28_anexo_estados_financieros',
  'q29_anexo_balance_comprobacion_y_notas',
  'q30_anexo_estado_situacion_financiera_y_notas',
  'q31_anexo_estado_rendimiento_financiero_y_notas',
  'q32_anexo_estado_movimiento_patrimonio_y_notas',
  'q33_anexo_relacion_cuentas_por_cobrar',
  'q34_anexo_relacion_cuentas_por_pagar',
  'q35_anexo_relacion_fondos_terceros',
  'q36_anexo_situacion_fondos_anticipo',
  'q37_anexo_situacion_caja_chica',
  'q38_anexo_acta_arqueo_caja_chica',
  'q39_anexo_listado_registro_proveedores',
  'q40_anexo_reporte_libros_contables',
  'q41_anexo_reporte_cuentas_bancarias',
  'q42_anexo_reporte_conciliaciones_bancarias',
  'q43_anexo_reporte_retenciones_pendientes',
  'q44_anexo_reporte_contrataciones_publicas',
  'q45_anexo_reporte_fideicomiso_prestaciones',
  'q46_anexo_reporte_bonos_vacacionales',
  'q47_anexo_mencion_numero_cargos_rrhh',
  'q48_incluye_cuadro_resumen_cargos',
  'q49_cuadro_resumen_cargos_validado_rrhh',
  'q50_anexo_reporte_nominas',
  'q51_anexo_inventario_bienes',
  'q52_inventario_bienes_fecha_entrega',
  'q53_inventario_bienes_comprobado_fisicamente',
  'q54_verificada_existencia_bienes_inventario',
  'q55_verificada_condicion_bienes_inventario',
  'q56_inventario_indica_responsable_patrimonial',
  'q57_inventario_indica_responsable_uso',
  'q58_inventario_indica_fecha_verificacion',
  'q59_inventario_indica_numero_acta_verificacion',
  'q60_inventario_indica_numero_registro_bien',
  'q61_inventario_indica_codigo_bien',
  'q62_inventario_indica_descripcion_bien',
  'q63_inventario_indica_marca_bien',
  'q64_inventario_indica_modelo_bien',
  'q65_inventario_indica_serial_bien',
  'q66_inventario_indica_estado_conservacion_bien',
  'q67_inventario_indica_ubicacion_bien',
  'q68_inventario_indica_valor_mercado_bien',
  'q69_anexo_ejecucion_poa',
  'q70_incluye_ejecucion_poa_fecha_entrega',
  'q71_incluye_causas_incumplimiento_metas_poa',
  'q72_incluye_plan_operativo_anual',
  'q73_anexo_indice_general_archivo',
  'q74_archivo_indica_clasificacion',
  'q75_archivo_indica_ubicacion_fisica',
  'q76_incluye_relacion_montos_fondos_asignados',
  'q77_incluye_saldo_efectivo_fondos',
  'q78_incluye_relacion_bienes_asignados',
  'q79_incluye_relacion_bienes_unidad_bienes',
  'q80_incluye_estados_bancarios_conciliados',
  'q81_incluye_lista_comprobantes_gastos',
  'q82_incluye_cheques_pendientes_cobro',
  'q83_incluye_reporte_transferencias_bancarias',
  'q84_anexo_caucion_funcionario_admin',
  'q85_incluye_cuadro_liquidado_recaudado',
  'q86_incluye_relacion_expedientes_investigacion',
  'q87_incluye_situacion_tesoro_nacional',
  'q88_incluye_ejecucion_presupuesto_nacional',
  'q89_incluye_monto_deuda_publica_nacional',
  'q90_incluye_situacion_cuentas_nacion',
  'q91_incluye_situacion_tesoro_estadal',
  'q92_incluye_ejecucion_presupuesto_estadal',
  'q93_incluye_situacion_cuentas_estadal',
  'q94_incluye_situacion_tesoro_municipal',
  'q95_incluye_ejecucion_presupuesto_municipal',
  'q96_incluye_situacion_cuentas_municipal',
  'q97_incluye_inventario_terrenos_municipales',
  'q98_incluye_relacion_ingresos_venta_terrenos',
];
