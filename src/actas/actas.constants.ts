// src/actas/actas.constants.ts

import { FindingDefinition } from '../audit/audit-ai.service';

/**
 * MAPA DE HALLAZGOS PARA ACTAS DE ENTREGA (Basado en Schema Frontend)
 *
 * Mapea las claves del objeto 'metadata' (Zod Schema) con la configuración
 * necesaria para que el servicio de IA realice la auditoría.
 */
export const ACTAS_FINDINGS_MAP: Record<string, FindingDefinition> = {
  // --- SITUACIÓN PRESUPUESTARIA ---
  disponeEstadoSituacionPresupuestaria: {
    pregunta: '¿El acta incluye el Estado de Situación Presupuestaria?',
    condicion: 'NO SE EVIDENCIÓ EL ESTADO DE SITUACIÓN PRESUPUESTARIA.',
  },
  disponeRelacionGastosComprometidosNoCausados: {
    pregunta:
      '¿El acta incluye la Relación de Gastos Comprometidos no causados?',
    condicion:
      'NO SE EVIDENCIÓ LA RELACIÓN DE GASTOS COMPROMETIDOS NO CAUSADOS.',
  },
  disponeRelacionGastosComprometidosCausadosNoPagados: {
    pregunta:
      '¿El acta incluye la Relación de Gastos Comprometidos, causados y no pagados?',
    condicion:
      'NO SE EVIDENCIÓ LA RELACIÓN DE GASTOS COMPROMETIDOS, CAUSADOS Y NO PAGADOS.',
  },
  disponeEstadoPresupuestarioPorPartidas: {
    pregunta: '¿El acta incluye el Estado Presupuestario por partidas?',
    condicion: 'NO SE EVIDENCIÓ EL ESTADO PRESUPUESTARIO POR PARTIDAS.',
  },
  disponeEstadoPresupuestarioDetalleCuentas: {
    pregunta:
      '¿El acta incluye el Estado Presupuestario con detalle de cuentas?',
    condicion:
      'NO SE EVIDENCIÓ EL ESTADO PRESUPUESTARIO CON DETALLE DE CUENTAS.',
  },

  // --- SITUACIÓN FINANCIERA Y PATRIMONIAL ---
  disponeEstadosFinancieros: {
    pregunta: '¿El acta incluye los Estados Financieros a la fecha de entrega?',
    condicion: 'NO SE EVIDENCIARON LOS ESTADOS FINANCIEROS.',
  },
  disponeBalanceComprobacion: {
    pregunta: '¿El acta incluye el Balance de Comprobación?',
    condicion: 'NO SE EVIDENCIÓ EL BALANCE DE COMPROBACIÓN.',
  },
  disponeEstadoSituacionFinanciera: {
    pregunta: '¿El acta incluye el Estado de Situación Financiera?',
    condicion: 'NO SE EVIDENCIÓ EL ESTADO DE SITUACIÓN FINANCIERA.',
  },
  disponeEstadoRendimientoFinanciero: {
    pregunta: '¿El acta incluye el Estado de Rendimiento Financiero?',
    condicion: 'NO SE EVIDENCIÓ EL ESTADO DE RENDIMIENTO FINANCIERO.',
  },
  disponeEstadoMovimientosPatrimonio: {
    pregunta: '¿El acta incluye el Estado de Movimientos del Patrimonio?',
    condicion: 'NO SE EVIDENCIÓ EL ESTADO DE MOVIMIENTOS DEL PATRIMONIO.',
  },
  disponeRelacionCuentasPorCobrar: {
    pregunta: '¿El acta incluye la Relación de Cuentas por Cobrar?',
    condicion: 'NO SE EVIDENCIÓ LA RELACIÓN DE CUENTAS POR COBRAR.',
  },
  disponeRelacionCuentasPorPagar: {
    pregunta: '¿El acta incluye la Relación de Cuentas por Pagar?',
    condicion: 'NO SE EVIDENCIÓ LA RELACIÓN DE CUENTAS POR PAGAR.',
  },
  disponeRelacionCuentasFondosTerceros: {
    pregunta: '¿El acta incluye la Relación de Cuentas de Fondos de Terceros?',
    condicion: 'NO SE EVIDENCIÓ LA RELACIÓN DE CUENTAS DE FONDOS DE TERCEROS.',
  },

  // --- TESORERÍA Y CAJA ---
  disponeSituacionFondosAnticipo: {
    pregunta: '¿El acta incluye la Situación de los Fondos en Anticipo?',
    condicion: 'NO SE EVIDENCIÓ LA SITUACIÓN DE LOS FONDOS EN ANTICIPO.',
  },
  disponeSituacionCajaChica: {
    pregunta: '¿El acta incluye la Situación de la Caja Chica?',
    condicion: 'NO SE EVIDENCIÓ LA SITUACIÓN DE LA CAJA CHICA.',
  },
  disponeActaArqueoCajasChicas: {
    pregunta: '¿El acta incluye el Acta de Arqueo de Cajas Chicas?',
    condicion: 'NO SE EVIDENCIÓ EL ACTA DE ARQUEO DE CAJAS CHICAS.',
  },

  // --- LIBROS Y REPORTES ---
  disponeListadoRegistroAuxiliarProveedores: {
    pregunta:
      '¿El acta incluye el Listado del Registro Auxiliar de Proveedores?',
    condicion:
      'NO SE EVIDENCIÓ EL LISTADO DEL REGISTRO AUXILIAR DE PROVEEDORES.',
  },
  disponeReportesLibrosContables: {
    pregunta: '¿El acta incluye los Reportes de Libros Contables?',
    condicion: 'NO SE EVIDENCIARON LOS REPORTES DE LIBROS CONTABLES.',
  },
  disponeReportesCuentasBancarias: {
    pregunta: '¿El acta incluye los Reportes de Cuentas Bancarias?',
    condicion: 'NO SE EVIDENCIARON LOS REPORTES DE CUENTAS BANCARIAS.',
  },
  disponeReportesConciliacionesBancarias: {
    pregunta: '¿El acta incluye los Reportes de Conciliaciones Bancarias?',
    condicion: 'NO SE EVIDENCIARON LOS REPORTES DE CONCILIACIONES BANCARIAS.',
  },
  disponeReportesRetenciones: {
    pregunta: '¿El acta incluye los Reportes de Retenciones?',
    condicion: 'NO SE EVIDENCIARON LOS REPORTES DE RETENCIONES.',
  },

  // --- CONTRATACIONES Y RRHH ---
  disponeReporteProcesosContrataciones: {
    pregunta: '¿El acta incluye el Reporte de Procesos de Contrataciones?',
    condicion: 'NO SE EVIDENCIÓ EL REPORTE DE PROCESOS DE CONTRATACIONES.',
  },
  disponeReporteFideicomisoPrestaciones: {
    pregunta: '¿El acta incluye el Reporte de Fideicomiso de Prestaciones?',
    condicion: 'NO SE EVIDENCIÓ EL REPORTE DE FIDEICOMISO DE PRESTACIONES.',
  },
  disponeReporteBonosVacacionales: {
    pregunta: '¿El acta incluye el Reporte de Bonos Vacacionales?',
    condicion: 'NO SE EVIDENCIÓ EL REPORTE DE BONOS VACACIONALES.',
  },
  disponeCuadroResumenCargos: {
    pregunta: '¿El acta incluye el Cuadro Resumen de Cargos?',
    condicion: 'NO SE EVIDENCIÓ EL CUADRO RESUMEN DE CARGOS.',
  },
  disponeCuadroResumenValidadoRRHH: {
    pregunta: '¿El Cuadro Resumen de Cargos está validado por RRHH?',
    condicion: 'EL CUADRO RESUMEN DE CARGOS NO ESTÁ VALIDADO POR RRHH.',
  },
  disponeReporteNominas: {
    pregunta: '¿El acta incluye el Reporte de Nóminas?',
    condicion: 'NO SE EVIDENCIÓ EL REPORTE DE NÓMINAS.',
  },

  // --- BIENES Y GESTIÓN ---
  disponeInventarioBienes: {
    pregunta: '¿El acta incluye el Inventario de Bienes?',
    condicion: 'NO SE EVIDENCIÓ EL INVENTARIO DE BIENES.',
  },
  disponeEjecucionPlanOperativo: {
    pregunta: '¿El acta incluye la Ejecución del Plan Operativo?',
    condicion: 'NO SE EVIDENCIÓ LA EJECUCIÓN DEL PLAN OPERATIVO.',
  },
  incluyeCausasIncumplimientoMetas: {
    pregunta: '¿Se incluyen las causas del incumplimiento de metas?',
    condicion: 'NO SE INCLUYERON LAS CAUSAS DEL INCUMPLIMIENTO DE METAS.',
  },
  disponePlanOperativoAnual: {
    pregunta: '¿El acta incluye el Plan Operativo Anual (POA)?',
    condicion: 'NO SE EVIDENCIÓ EL PLAN OPERATIVO ANUAL.',
  },

  // --- ARCHIVO ---
  disponeClasificacionArchivo: {
    pregunta: '¿Se incluye la clasificación del archivo?',
    condicion: 'NO SE EVIDENCIÓ LA CLASIFICACIÓN DEL ARCHIVO.',
  },
  incluyeUbicacionFisicaArchivo: {
    pregunta: '¿Se incluye la ubicación física del archivo?',
    condicion: 'NO SE INDICÓ LA UBICACIÓN FÍSICA DEL ARCHIVO.',
  },

  // --- OTROS (Paso 10 - Opcionales) ---
  disponeRelacionMontosFondosAsignados: {
    pregunta: '¿Se incluye la relación de montos de fondos asignados?',
    condicion: 'NO SE EVIDENCIÓ LA RELACIÓN DE MONTOS DE FONDOS ASIGNADOS.',
  },
  disponeSaldoEfectivoFondos: {
    pregunta: '¿Se incluye el saldo en efectivo de los fondos?',
    condicion: 'NO SE EVIDENCIÓ EL SALDO EN EFECTIVO DE LOS FONDOS.',
  },
  disponeRelacionBienesAsignados: {
    pregunta: '¿Se incluye la relación de bienes asignados?',
    condicion: 'NO SE EVIDENCIÓ LA RELACIÓN DE BIENES ASIGNADOS.',
  },
  disponeRelacionBienesAsignadosUnidadBienes: {
    pregunta:
      '¿Se incluye la relación de bienes asignados por la Unidad de Bienes?',
    condicion: 'NO SE EVIDENCIÓ LA RELACIÓN EMITIDA POR LA UNIDAD DE BIENES.',
  },
  disponeEstadosBancariosConciliados: {
    pregunta: '¿Se incluyen los estados bancarios conciliados?',
    condicion: 'NO SE EVIDENCIARON LOS ESTADOS BANCARIOS CONCILIADOS.',
  },
  disponeListaComprobantesGastos: {
    pregunta: '¿Se incluye la lista de comprobantes de gastos?',
    condicion: 'NO SE EVIDENCIÓ LA LISTA DE COMPROBANTES DE GASTOS.',
  },
  disponeChequesEmitidosPendientesCobro: {
    pregunta: '¿Se incluyen los cheques emitidos pendientes de cobro?',
    condicion: 'NO SE EVIDENCIÓ LA RELACIÓN DE CHEQUES PENDIENTES DE COBRO.',
  },
  disponeListadoTransferenciaBancaria: {
    pregunta: '¿Se incluye el listado de transferencias bancarias?',
    condicion: 'NO SE EVIDENCIÓ EL LISTADO DE TRANSFERENCIAS BANCARIAS.',
  },
  disponeCaucionFuncionario: {
    pregunta: '¿Se incluye la caución del funcionario responsable?',
    condicion: 'NO SE EVIDENCIÓ LA CAUCIÓN DEL FUNCIONARIO.',
  },
  disponeCuadroDemostrativoRecaudado: {
    pregunta: '¿Se incluye el cuadro demostrativo de lo recaudado?',
    condicion: 'NO SE EVIDENCIÓ EL CUADRO DEMOSTRATIVO DE LO RECAUDADO.',
  },
  disponeRelacionExpedientesAbiertos: {
    pregunta: '¿Se incluye la relación de expedientes abiertos?',
    condicion: 'NO SE EVIDENCIÓ LA RELACIÓN DE EXPEDIENTES ABIERTOS.',
  },

  // --- ESPECÍFICOS NACIONALES/ESTADALES/MUNICIPALES ---
  disponeSituacionTesoroNacional: {
    pregunta: '¿Se incluye la situación del Tesoro Nacional?',
    condicion: 'NO SE EVIDENCIÓ LA SITUACIÓN DEL TESORO NACIONAL.',
  },
  disponeInfoEjecucionPresupuestoNacional: {
    pregunta: '¿Se incluye información de ejecución del presupuesto nacional?',
    condicion:
      'NO SE EVIDENCIÓ INFORMACIÓN DE EJECUCIÓN DEL PRESUPUESTO NACIONAL.',
  },
  disponeMontoDeudaPublicaNacional: {
    pregunta: '¿Se incluye el monto de la deuda pública nacional?',
    condicion: 'NO SE EVIDENCIÓ EL MONTO DE LA DEUDA PÚBLICA NACIONAL.',
  },
  disponeSituacionCuentasNacion: {
    pregunta: '¿Se incluye la situación de las cuentas de la Nación?',
    condicion: 'NO SE EVIDENCIÓ LA SITUACIÓN DE LAS CUENTAS DE LA NACIÓN.',
  },
  disponeSituacionTesoroEstadal: {
    pregunta: '¿Se incluye la situación del Tesoro Estadal?',
    condicion: 'NO SE EVIDENCIÓ LA SITUACIÓN DEL TESORO ESTADAL.',
  },
  disponeInfoEjecucionPresupuestoEstadal: {
    pregunta: '¿Se incluye información de ejecución del presupuesto estadal?',
    condicion:
      'NO SE EVIDENCIÓ INFORMACIÓN DE EJECUCIÓN DEL PRESUPUESTO ESTADAL.',
  },
  disponeSituacionCuentasEstado: {
    pregunta: '¿Se incluye la situación de las cuentas del Estado?',
    condicion: 'NO SE EVIDENCIÓ LA SITUACIÓN DE LAS CUENTAS DEL ESTADO.',
  },
  disponeSituacionTesoroDistritalMunicipal: {
    pregunta: '¿Se incluye la situación del Tesoro Distrital/Municipal?',
    condicion: 'NO SE EVIDENCIÓ LA SITUACIÓN DEL TESORO DISTRITAL/MUNICIPAL.',
  },
  disponeInfoEjecucionPresupuestoDistritalMunicipal: {
    pregunta:
      '¿Se incluye información de ejecución del presupuesto distrital/municipal?',
    condicion:
      'NO SE EVIDENCIÓ INFORMACIÓN DE EJECUCIÓN DEL PRESUPUESTO MUNICIPAL.',
  },
  disponeSituacionCuentasDistritalesMunicipales: {
    pregunta: '¿Se incluye la situación de cuentas distritales/municipales?',
    condicion: 'NO SE EVIDENCIÓ LA SITUACIÓN DE CUENTAS MUNICIPALES.',
  },
  disponeInventarioTerrenosEjidos: {
    pregunta: '¿Se incluye el inventario de terrenos ejidos?',
    condicion: 'NO SE EVIDENCIÓ EL INVENTARIO DE TERRENOS EJIDOS.',
  },
  disponeRelacionIngresosVentaTerrenos: {
    pregunta: '¿Se incluye la relación de ingresos por venta de terrenos?',
    condicion: 'NO SE EVIDENCIÓ LA RELACIÓN DE INGRESOS POR VENTA DE TERRENOS.',
  },
};
