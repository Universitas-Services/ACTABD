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
    criterio: 'ARTÍCULO 10.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>El acta contiene el lugar de la suscripción:</b>\n' +
      '<b>Hallazgo:</b> Se evidenció que no contiene lugar de suscripción.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 10.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q2_acta_contiene_fecha_suscripcion: {
    pregunta: '¿El acta contiene fecha de la suscripción?',
    condicion: 'SE EVIDENCIÓ QUE NO CONTIENE LA FECHA DE SUSCRIPCIÓN',
    criterio: 'ARTÍCULO 10.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>El acta contiene fecha de la suscripción:</b>\n' +
      '<b>Hallazgo:</b> Se evidenció que no contiene fecha de suscripción.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 10.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q3_acta_identifica_organo_entregado: {
    pregunta:
      '¿El acta contiene la identificación del órgano, entidad, oficina o dependencia que se entrega?',
    condicion:
      'SE CONSTATÓ QUE NO CONTIENE IDENTIFICACIÓN DEL ÓRGANO, ENTIDAD, OFICINA O DEPENDENCIA QUE SE ENTREGA',
    criterio: 'ARTÍCULO 10.2 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>El acta contiene la identificación del órgano, entidad, oficina o dependencia que se entrega:</b>\n' +
      '<b>Hallazgo:</b> Se constató que no contiene identificación del órgano, entidad, oficina o dependencia que se entrega.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 10.2 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q4_acta_identifica_servidor_entrega: {
    pregunta: '¿En el acta identifica a la persona quien entrega?',
    condicion: 'SE EVIDENCIÓ QUE NO SE IDENTIFICA LA PERSONA QUIEN ENTREGA.',
    criterio: 'ARTÍCULO 10.3 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
    observacionHtml:
      '<b>En el acta identifica a la persona quien entrega:</b>\n' +
      '<b>Hallazgo:</b> Se evidenció que no se identifica la persona quien entrega.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 10.3 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q5_acta_identifica_servidor_recibe: {
    pregunta: '¿En el acta se identifica la persona quien recibe?',
    condicion: 'SE CONSTATÓ QUE NO SE IDENTIFICA LA PERSONA QUIEN RECIBE',
    criterio: 'ARTÍCULO 10.3 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>En el acta se identifica la persona quien recibe:</b>\n' +
      '<b>Hallazgo:</b> Se constató que no se identifica la persona quien recibe.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 10.3 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q6_acta_describe_motivo_entrega: {
    pregunta: '¿El acta describe el motivo de la entrega?',
    condicion: 'SE EVIDENCIÓ QUE NO DESCRIBE EL MOTIVO DE LA ENTREGA',
    criterio: 'ARTÍCULO 10.4 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>El acta describe el motivo de la entrega:</b>\n' +
      '<b>Hallazgo:</b> Se evidenció que no describe el motivo de la entrega.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 10.4 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q7_acta_describe_fundamento_legal: {
    pregunta: '¿El acta describe la fundamentación legal de la entrega?',
    condicion:
      'SE CONSTATÓ QUE NO DESCRIBE LA FUNDAMENTACIÓN LEGAL DE LA ENTREGA.',
    criterio: 'ARTÍCULO 10.4 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
    observacionHtml:
      '<b>El acta describe la fundamentación legal de la entrega:</b>\n' +
      '<b>Hallazgo:</b> Se constató que no describe la fundamentación legal de la entrega.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 10.4 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q8_acta_contiene_relacion_anexos_normas: {
    pregunta:
      '¿El acta contiene una relación completa de los anexos que la acompañan y que se mencionan en los artículos 11 al 17 de las Normas que regulan la entrega de órganos, entes y oficinas de la AP?',
    condicion:
      'SE EVIDENCIÓ QUE NO CONTIENE RELACIÓN COMPLETA DE LOS ANEXOS QUE ACOMPAÑAN EL ACTA.',
    criterio: 'ARTÍCULO 10.5 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
    observacionHtml:
      '<b>El acta contiene una relación completa de los anexos que la acompañan y que se mencionan en los artículos 11 al 17 de las Normas que regulan la entrega de órganos, entes y oficinas de la AP:</b>\n' +
      '<b>Hallazgo:</b> Se evidenció que no contiene relación completa de los anexos que acompañan el acta.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 10.5 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q9_acta_expresa_integracion_anexos: {
    pregunta:
      '¿En el acta de entrega se expresa que los anexos forman parte integrante de la misma?',
    condicion:
      'SE CONSTATÓ QUE NO EXPRESA QUE LOS ANEXOS FORMAN PARTE INTEGRANTE DE LA MISMA.',
    criterio: 'ARTÍCULO 10.5 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
    observacionHtml:
      '<b>En el acta de entrega se expresa que los anexos forman parte integrante de la misma:</b>\n' +
      '<b>Hallazgo:</b> Se constató que no expresa que los anexos forman parte integrante de la misma.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 10.5 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q10_acta_suscrita_por_quien_entrega: {
    pregunta: '¿El acta se encuentra suscrita por parte de quien entrega?',
    condicion: 'SE EVIDENCIÓ QUE NO SE ENCUENTRA SUSCRITA POR  QUIEN ENTREGA.',
    criterio: 'ARTÍCULO 10.6 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
    observacionHtml:
      '<b>El acta se encuentra suscrita por parte de quien entrega:</b>\n' +
      '<b>Hallazgo:</b> Se evidenció que no se encuentra suscrita por  quien entrega.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 10.6 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q11_acta_suscrita_por_quien_recibe: {
    pregunta: '¿El acta se encuentra suscrita por parte de quien recibe?',
    condicion: 'SE CONSTATÓ QUE NO SE ENCUENTRA SUSCRITA POR  QUIEN RECIBE.',
    criterio: 'ARTÍCULO 10.6 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
    observacionHtml:
      '<b>El acta se encuentra suscrita por parte de quien recibe:</b>\n' +
      '<b>Hallazgo:</b> Se constató que no se encuentra suscrita por  quien recibe.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 10.6 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q12_anexa_informacion_adicional: {
    pregunta:
      '¿Se anexa otra información o documentación que se considere necesaria?',
    condicion:
      'NO SE EVIDENCIÓ EL ANEXO DE OTRA INFORMACIÓN O DOCUMENTACIÓN CONSIDERADA NECESARIA.',
    criterio: 'ARTÍCULO 11.6 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
    observacionHtml:
      '<b>Se anexa otra información o documentación que se considere necesaria:</b>\n' +
      '<b>Hallazgo:</b> No se evidencio el anexo de otra información o documentación considerada necesaria.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.6 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q13_anexos_con_fecha_corte_al_cese: {
    pregunta:
      '¿Los documentos anexos del acta de entrega presentan la información con fecha de corte al momento del cese en el ejercicio del empleo, cargo o función pública del servidor público que entrega?',
    condicion:
      'SE EVIDENCIÓ QUE LOS DOCUMENTOS ANEXOS DEL ACTA DE ENTREGA NO PRESENTAN LA INFORMACIÓN CON FECHA DE CORTE AL MOMENTO DEL CESE EN EL EJERCICIO DEL EMPLEO, CARGO O FUNCIÓN PÚBLICA DEL SERVIDOR PÚBLICO QUE ENTREGA.',
    criterio: 'ARTÍCULO 18 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
    observacionHtml:
      '<b>Los documentos anexos del acta de entrega presentan la información con fecha de corte al momento del cese en el ejercicio del empleo, cargo o función pública del servidor público que entrega:</b>\n' +
      '<b>Hallazgo:</b> Se evidenció que los documentos anexos del acta de entrega no presentan la información con fecha de corte al momento del cese en el ejercicio del empleo, cargo o función pública del servidor público que entrega.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 18 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q14_acta_deja_constancia_inexistencia_info: {
    pregunta:
      '¿En el acta de entrega  se deja constancia de la  inexistencia de  información o documentos requeridos en los artículos 10 al 17 de la norma que regula la materia, según corresponda?',
    condicion:
      'EN EL ACTA DE ENTREGA  NO SE DEJA CONSTANCIA DE LA  INEXISTENCIA DE  INFORMACIÓN O DOCUMENTOS REQUERIDOS EN LOS ARTÍCULOS 10 AL 17 DE LA NORMA QUE REGULA LA MATERIA, SEGÚN CORRESPONDA.',
    criterio: 'ARTÍCULO 19 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
    observacionHtml:
      '<b>En el acta de entrega  se deja constancia de la  inexistencia de  información o documentos requeridos en los artículos 10 al 17 de la norma que regula la materia, según corresponda:</b>\n' +
      '<b>Hallazgo:</b> En el acta de entrega  no se deja constancia de la  inexistencia de  información o documentos requeridos en los artículos 10 al 17 de la norma que regula la materia, según corresponda.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 19 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q15_acta_especifica_errores_omisiones: {
    pregunta:
      '¿El acta de entrega específica errores, deficiencias u omisiones en el levantamiento de la misma?',
    condicion:
      'EL ACTA DE ENTREGA NO ESPECÍFICA ERRORES, DEFICIENCIAS U OMISIONES EN EL LEVANTAMIENTO DE LA MISMA.',
    criterio: 'ARTÍCULO 20 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
    observacionHtml:
      '<b>El acta de entrega específica errores, deficiencias u omisiones en el levantamiento de la misma:</b>\n' +
      '<b>Hallazgo:</b> El acta de entrega no específica errores, deficiencias u omisiones en el levantamiento de la misma.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 20 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q16_acta_elaborada_original_y_3_copias: {
    pregunta:
      '¿El acta de entrega y sus anexos fue elaborada en original y tres (03) copias certificadas?',
    condicion:
      'EL ACTA DE ENTREGA Y SUS ANEXOS NO FUE ELABORADA EN ORIGINAL Y TRES (03) COPIAS CERTIFICADAS.',
    criterio: 'ARTÍCULO 21 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
    observacionHtml:
      '<b>El acta de entrega y sus anexos fue elaborada en original y tres (03) copias certificadas:</b>\n' +
      '<b>Hallazgo:</b> El acta de entrega y sus anexos no fue elaborada en original y tres (03) copias certificadas.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 21 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q17_incluye_autorizacion_certificar_copias: {
    pregunta:
      '¿Se incluye el documento que debidamente autoriza al Servidor Público a certificar las copias del Acta de Entrega?',
    condicion:
      'NO SE INCLUYE EL DOCUMENTO QUE DEBIDAMENTE AUTORIZA AL SERVIDOR PÚBLICO A CERTIFICAR LAS COPIAS DEL ACTA DE ENTREGA.',
    criterio: 'ARTÍCULO 21 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
    observacionHtml:
      '<b>Se incluye el documento que debidamente autoriza al Servidor Público a certificar las copias del Acta de Entrega:</b>\n' +
      '<b>Hallazgo:</b> No se incluye el documento que debidamente autoriza al servidor público a certificar las copias del acta de entrega.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 21 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q18_original_archivado_despacho_autoridad: {
    pregunta:
      '¿El original del acta de entrega y sus anexos fue archivada en el despacho de  la máxima autoridad jerárquica del órgano o entidad o en la oficina o dependencia que se entrega?',
    condicion:
      'EL ORIGINAL DEL ACTA DE ENTREGA Y SUS ANEXOS NO FUE ARCHIVADA EN EL DESPACHO DE  LA MÁXIMA AUTORIDAD JERÁRQUICA DEL ÓRGANO O ENTIDAD O EN LA OFICINA O DEPENDENCIA QUE SE ENTREGA.',
    criterio: 'ARTÍCULO 21 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
    observacionHtml:
      '<b>El original del acta de entrega y sus anexos fue archivada en el despacho de  la máxima autoridad jerárquica del órgano o entidad o en la oficina o dependencia que se entrega:</b>\n' +
      '<b>Hallazgo:</b> El original del acta de entrega y sus anexos no fue archivada en el despacho de  la máxima autoridad jerárquica del órgano o entidad o en la oficina o dependencia que se entrega.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 21 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q19_copia_certificada_entregada_a_servidor_recibe: {
    pregunta:
      '¿Una copia certificada del acta de entrega y sus anexos fue entregada al servidor público que recibe?',
    condicion:
      'COPIA CERTIFICADA DEL ACTA DE ENTREGA Y SUS ANEXOS  NO FUE ENTREGADA AL SERVIDOR PÚBLICO QUE RECIBE.',
    criterio: 'ARTÍCULO 21 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
    observacionHtml:
      '<b>Una copia certificada del acta de entrega y sus anexos fue entregada al servidor público que recibe:</b>\n' +
      '<b>Hallazgo:</b> Copia certificada del acta de entrega y sus anexos  no fue entregada al servidor público que recibe.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 21 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q20_copia_certificada_entregada_a_servidor_entrega: {
    pregunta:
      '¿Una copia certificada del acta de entrega y sus anexos fue entregada al servidor público que entrega?',
    condicion:
      'COPIA CERTIFICADA DEL ACTA DE ENTREGA Y SUS ANEXOS  NO FUE ENTREGADA AL SERVIDOR PÚBLICO QUE ENTREGA.',
    criterio: 'ARTÍCULO 21 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
    observacionHtml:
      '<b>Una copia certificada del acta de entrega y sus anexos fue entregada al servidor público que entrega:</b>\n' +
      '<b>Hallazgo:</b> Copia certificada del acta de entrega y sus anexos  no fue entregada al servidor público que entrega.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 21 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q21_copia_entregada_auditoria_interna_en_plazo: {
    pregunta:
      '¿Se entregó una copia certificada del acta de entrega y sus anexos a la unidad de auditoría interna del órgano o entidad dentro de los cinco (05) días hábiles siguientes de la fecha de suscripción de la misma?',
    condicion:
      'NO SE ENTREGÓ UNA COPIA CERTIFICADA DEL ACTA DE ENTREGA Y SUS ANEXOS A LA UNIDAD DE AUDITORÍA INTERNA DEL ÓRGANO O ENTIDAD DENTRO DE LOS CINCO (05) DÍAS HÁBILES SIGUIENTES DE LA FECHA DE SUSCRIPCIÓN DE LA MISMA.',
    criterio: 'ARTÍCULO 21 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
    observacionHtml:
      '<b>Se entregó una copia certificada del acta de entrega y sus anexos a la unidad de auditoría interna del órgano o entidad dentro de los cinco (05) días hábiles siguientes de la fecha de suscripción de la misma:</b>\n' +
      '<b>Hallazgo:</b> No se entregó una copia certificada del acta de entrega y sus anexos a la unidad de auditoría interna del órgano o entidad dentro de los cinco (05) días hábiles siguientes de la fecha de suscripción de la misma.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 21 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q22_anexo_estado_cuentas_general: {
    pregunta:
      '¿El Acta de entrega tiene como anexo: Estado de las cuentas que reflejen la situación presupuestaria, financiera y patrimonial, cuando sea aplicable.?',
    condicion:
      'SE EVIDENCIÓ QUE NO CONTIENE INFORMACIÓN SOBRE LA SITUACIÓN  PRESUPUESTARIA, FINANCIERA Y PATRIMONIAL.',
    criterio: 'ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
    observacionHtml:
      '<b>Estado de las cuentas que refleje la situación presupuestaria, financiera y patrimonial, cuando sea aplicable:</b>\n' +
      '<b>Hallazgo:</b> Se evidenció que no contiene información sobre la situación  presupuestaria, financiera y patrimonial.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q23_anexo_situacion_presupuestaria_detallada: {
    pregunta:
      '¿El Estado de Situación Presupuestaria  muestra todos los momentos presupuestarios y sus detalles.\nIncluye: Presupuesto Original, Modificaciones, Presupuesto Modificado, Compromisos, Causado, Pagado, Por Pagar y Presupuesto Disponible a la fecha de entrega?',
    condicion:
      'SE EVIDENCIÓ QUE NO CONTIENE LA SITUACIÓN  PRESUPUESTARIA Y SUS DETALLES.',
    criterio: 'ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
    observacionHtml:
      '<b>El Estado de Situación Presupuestaria  muestra todos los momentos presupuestarios y sus detalles.\nIncluye: Presupuesto Original, Modificaciones, Presupuesto Modificado, Compromisos, Causado, Pagado, Por Pagar y Presupuesto Disponible:</b>\n' +
      '<b>Hallazgo:</b> Se evidenció que no contiene la situación  presupuestaria y sus detalles.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q24_anexo_gastos_comprometidos_no_causados: {
    pregunta:
      '¿El Acta de entrega tiene como anexo: Relación de Gastos Comprometidos, no causados a la fecha de entrega?',
    condicion:
      'SE CONSTATÓ QUE NO CONTIENE EL ANEXO DE RELACIÓN DE GASTOS COMPROMETIDOS, NO CAUSADOS A LA FECHA DEL CESE DE FUNCIONES.',
    criterio: 'ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
    observacionHtml:
      '<b>Relación de Gastos Comprometidos, no causados a la fecha del cese de funciones:</b>\n' +
      '<b>Hallazgo:</b> Se constató que no contiene el anexo de relación de gastos comprometidos, no causados a la fecha del cese de funciones.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q25_anexo_gastos_causados_no_pagados: {
    pregunta:
      '¿El Acta de entrega tiene como anexo: Relación de Gastos Comprometidos, causados y no pagados a la fecha de entrega?',
    condicion:
      'SE CONSTATÓ QUE NO CONTIENE EL ANEXO DE RELACIÓN DE GASTOS COMPROMETIDOS, CAUSADOS Y NO PAGADOS A LA FECHA DEL CESE DE FUNCIONES.',
    criterio: 'ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
    observacionHtml:
      '<b>Relación de Gastos Comprometidos, causados y no pagados a la fecha del cese de funciones:</b>\n' +
      '<b>Hallazgo:</b> Se constató que no contiene el anexo de relación de gastos comprometidos, causados y no pagados a la fecha del cese de funciones.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q26_anexo_estado_presupuestario_por_partidas: {
    pregunta:
      '¿El Acta de entrega tiene como anexo: El Estado Presupuestario del Ejercicio vigente por partidas?',
    condicion:
      'SE CONSTATÓ QUE NO CONTIENE EL ANEXO ESTADO PRESUPUESTARIO DEL EJERCICIO VIGENTE POR PARTIDAS.',
    criterio: 'ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
    observacionHtml:
      '<b>El Estado Presupuestario del Ejercicio vigente por partidas:</b>\n' +
      '<b>Hallazgo:</b> Se constató que no contiene el anexo estado presupuestario del ejercicio vigente por partidas.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q27_anexo_estado_presupuestario_por_cuentas: {
    pregunta:
      '¿El Acta de entrega tiene como anexo: El Estado Presupuestario del Ejercicio con los detalles de sus cuentas?',
    condicion:
      'SE CONSTATÓ QUE NO CONTIENE EL ANEXO ESTADO PRESUPUESTARIO DEL EJERCICIO CON LOS DETALLES DE SUS CUENTAS.',
    criterio: 'ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
    observacionHtml:
      '<b>El Estado Presupuestario del Ejercicio con los detalles de sus cuentas:</b>\n' +
      '<b>Hallazgo:</b> Se constató que no contiene el anexo estado presupuestario del ejercicio con los detalles de sus cuentas.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q28_anexo_estados_financieros: {
    pregunta:
      '¿El Acta de entrega tiene como anexo: Estados Financieros a la fecha de entrega?',
    condicion:
      'SE EVIDENCIÓ QUE NO CONTIENE EL ANEXO LOS ESTADOS FINANCIEROS A LA FECHA DE ENTREGA.',
    criterio: 'ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
    observacionHtml:
      '<b>Estados Financieros a la fecha de entrega:</b>\n' +
      '<b>Hallazgo:</b> Se evidenció que no contiene el anexo los estados financieros a la fecha de entrega.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q29_anexo_balance_comprobacion_y_notas: {
    pregunta:
      '¿El Acta de entrega tiene como anexo: El Balance de Comprobación a la fecha de elaboración de los Estados Financieros y sus notas explicativas a la fecha de entrega?',
    condicion:
      'SE EVIDENCIÓ QUE NO CONTIENE EL ANEXO LOS ESTADOS FINANCIEROS A LA FECHA DE ENTREGA.',
    criterio: 'ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
    observacionHtml:
      '<b>Estados Financieros a la fecha de entrega:</b>\n' +
      '<b>Hallazgo:</b> Se evidenció que no contiene el anexo los estados financieros a la fecha de entrega.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q30_anexo_estado_situacion_financiera_y_notas: {
    pregunta:
      '¿El Acta de entrega tiene como anexo: Estado de Situación Financiera / Balance General y sus notas explicativas a la fecha de entrega?',
    condicion:
      'SE CONSTATÓ QUE NO CONTIENE EL ANEXO ESTADO DE SITUACIÓN FINANCIERA / BALANCE GENERAL Y SUS NOTAS EXPLICATIVAS A LA FECHA DE ENTREGA',
    criterio: 'ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Estado de Situación Financiera / Balance General y sus notas explicativas a la fecha de entrega:</b>\n' +
      '<b>Hallazgo:</b> Se constató que no contiene el anexo estado de situación financiera / balance general y sus notas explicativas a la fecha de entrega.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q31_anexo_estado_rendimiento_financiero_y_notas: {
    pregunta:
      '¿El Acta de entrega tiene como anexo: Estado de Rendimiento Financiero / Estado de Ganancia y Pérdidas y sus notas explicativas a la fecha de entrega?',
    condicion:
      'SE CONSTATÓ QUE NO CONTIENE EL ANEXO ESTADO DE RENDIMIENTO FINANCIERO / ESTADO DE GANANCIA Y PÉRDIDAS Y SUS NOTAS EXPLICATIVAS A LA FECHA DE ENTREGA',
    criterio: 'ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Estado de Rendimiento Financiero / Estado de Ganancia y Pérdidas y sus notas explicativas a la fecha de entrega:</b>\n' +
      '<b>Hallazgo:</b> Se constató que no contiene el anexo estado de rendimiento financiero / estado de ganancia y pérdidas y sus notas explicativas a la fecha de entrega.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q32_anexo_estado_movimiento_patrimonio_y_notas: {
    pregunta:
      '¿El Acta de entrega tiene como anexo: Estado de Movimientos de las Cuentas de Patrimonio y sus notas explicativas a la fecha de entrega?',
    condicion:
      'SE CONSTATÓ QUE NO CONTIENE EL ANEXO ESTADO DE MOVIMIENTOS DE LAS CUENTAS DE PATRIMONIO Y SUS NOTAS EXPLICATIVAS A LA FECHA DE ENTREGA',
    criterio: 'ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Estado de Movimientos de las Cuentas de Patrimonio y sus notas explicativas a la fecha de entrega:</b>\n' +
      '<b>Hallazgo:</b> Se constató que no contiene el anexo estado de movimientos de las cuentas de patrimonio y sus notas explicativas a la fecha de entrega.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q33_anexo_relacion_cuentas_por_cobrar: {
    pregunta:
      '¿El Acta de entrega tiene como anexo: Una Relación de Cuentas por Cobrar a la fecha del Acta de Entrega?',
    condicion:
      'SE CONSTATÓ QUE NO CONTIENE EL ANEXO RELACIÓN DE CUENTAS POR COBRAR A LA FECHA DEL ACTA DE ENTREGA',
    criterio: 'ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Una  Relación de Cuentas por Cobrar a la fecha del Acta de Entrega:</b>\n' +
      '<b>Hallazgo:</b> Se constató que no contiene el anexo relación de cuentas por cobrar a la fecha del acta de entrega.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q34_anexo_relacion_cuentas_por_pagar: {
    pregunta:
      '¿El Acta de entrega tiene como anexo: Una Relación de Cuentas por Pagar a la fecha del Acta de Entrega?',
    condicion:
      'SE CONSTATÓ QUE NO CONTIENE EL ANEXO RELACIÓN DE CUENTAS POR PAGAR A LA FECHA DEL ACTA DE ENTREGA',
    criterio: 'ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Una  Relación de Cuentas por Pagar a la fecha del Acta de Entrega:</b>\n' +
      '<b>Hallazgo:</b> Se constató que no contiene el anexo relación de cuentas por pagar a la fecha del acta de entrega.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q35_anexo_relacion_fondos_terceros: {
    pregunta:
      '¿El Acta de entrega tiene como anexo: Una Relación de las Cuentas de los Fondos de Terceros?',
    condicion:
      'SE CONSTATÓ QUE NO CONTIENE EL ANEXO RELACIÓN DE LAS CUENTAS FONDO DE TERCEROS',
    criterio: 'ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Una Relación de las Cuentas de los Fondos de Terceros:</b>\n' +
      '<b>Hallazgo:</b> se constató que no contiene el anexo relación de las cuentas fondo de terceros.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q36_anexo_situacion_fondos_anticipo: {
    pregunta:
      '¿El Acta de entrega tiene como anexo: La Situación de los Fondos en Anticipo?',
    condicion:
      'SE CONSTATÓ QUE NO CONTIENE EL ANEXO SITUACIÓN DE LOS FONDOS EN ANTICIPO',
    criterio: 'ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>La  Situación de los Fondos en Anticipo:</b>\n' +
      '<b>Hallazgo:</b> Se constató que no contiene el anexo situación de los fondos en anticipo.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q37_anexo_situacion_caja_chica: {
    pregunta:
      '¿El Acta de entrega tiene como anexo: La Situación de la Caja Chica?',
    condicion:
      'SE CONSTATÓ QUE NO CONTIENE EL ANEXO SITUACIÓN DE LA CAJA CHICA',
    criterio: 'ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>La  Situación de la Caja Chica:</b>\n' +
      '<b>Hallazgo:</b> Se constató que no contiene el anexo situación de la caja chica.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q38_anexo_acta_arqueo_caja_chica: {
    pregunta:
      '¿El Acta de entrega tiene como anexo: Acta de arqueo de las Cajas Chicas a la fecha de entrega?',
    condicion:
      'SE CONSTATÓ QUE NO CONTIENE EL ANEXO ACTA DE ARQUEO DE LAS  CAJAS CHICAS A LA FECHA DE ENTREGA',
    criterio: 'ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Acta de arqueo de las Cajas Chicas a la fecha de entrega:</b>\n' +
      '<b>Hallazgo:</b> Se constató que no contiene el anexo acta de arqueo de las  cajas chicas a la fecha de entrega.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q39_anexo_listado_registro_proveedores: {
    pregunta:
      '¿El Acta de entrega tiene como anexo: Listado del Registro Auxiliar de Proveedores?',
    condicion:
      'SE EVIDENCIÓ QUE NO SE ENTREGÓ LISTADO DEL  REGISTRO AUXILIAR DE PROVEEDORES',
    criterio: 'ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Listado del Registro Auxiliar de Proveedores:</b>\n' +
      '<b>Hallazgo:</b> Se evidenció que no se entregó listado del  registro auxiliar de proveedores.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.1 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q40_anexo_reporte_libros_contables: {
    pregunta:
      '¿El Acta de entrega tiene como anexo: Reportes de Libros Contables (Diario y mayores analíticos) a la fecha del cese de funciones.?',
    condicion:
      'SE EVIDENCIÓ QUE NO SE ENTREGÓ EL REPORTE DE LIBROS CONTABLES (DIARIO Y MAYORES ANALÍTICOS)',
    criterio:
      'Normas para la Formación, participación, rendición, examen y calificación de las cuentas de los órganos del Poder Público: Nacional, Estadal,Distrital,Municipal y sus entes descentralizados.\nArt.14 Formación antes del cierre de la Cuenta.',
    observacionHtml:
      '<b>Reportes de Libros Contables (Diario y mayores analíticos):</b>\n' +
      '<b>Hallazgo:</b> Se evidenció que no se entregó el Reporte de Libros Contables (Diario y mayores analíticos).\n' +
      '<b>Descripción:</b> Incumplimiento a las Normas para la Formación, participación, rendición, examen y calificación de las cuentas de los órganos del Poder Público: Nacional, Estadal,Distrital,Municipal y sus entes descentralizados.\nArt.14 Formación antes del cierre de la Cuenta.',
  },
  q41_anexo_reporte_cuentas_bancarias: {
    pregunta:
      '¿El Acta de entrega tiene como anexo: Reportes de las Cuentas Bancarias  (Movimientos a la fecha del cese de funciones)?',
    condicion:
      'SE EVIDENCIÓ QUE NO SE ENTREGÓ EL REPORTE DE LAS CUENTAS BANCARIAS (MOVIMIENTOS A LA FECHA DEL CESE DE FUNCIONES',
    criterio:
      'Normas para la Formación, participación, rendición, examen y calificación de las cuentas de los órganos del Poder Público: Nacional, Estadal,Distrital,Municipal y sus entes descentralizados.\nArt.14 Formación antes del cierre de la Cuenta.',
    observacionHtml:
      '<b>Reportes de las Cuentas Bancarias (Movimientos a la fecha del cese de funciones):</b>\n' +
      '<b>Hallazgo:</b> Se evidenció que no se entregó el Reporte de las Cuentas Bancarias (Movimientos a la fecha del cese de funciones)\n' +
      '<b>Descripción:</b> Incumplimiento a las Normas para la Formación, participación, rendición, examen y calificación de las cuentas de los órganos del Poder Público: Nacional, Estadal, Distrital, Municipal y sus entes descentralizados.\nArt.14 Formación antes del cierre de la Cuenta.',
  },
  q42_anexo_reporte_conciliaciones_bancarias: {
    pregunta:
      '¿El Acta de entrega tiene como anexo: Reportes de las Conciliaciones Bancarias a la fecha del cese de funciones?',
    condicion:
      'SE EVIDENCIÓ QUE NO SE ENTREGÓ EL REPORTE DE LAS CONCILIACIONES BANCARIAS.',
    criterio:
      'Normas para la Formación, participación, rendición, examen y calificación de las cuentas de los órganos del Poder Público: Nacional, Estadal,Distrital,Municipal y sus entes descentralizados.\nArt.14 Formación antes del cierre de la Cuenta.',
    observacionHtml:
      '<b>Reportes de las Conciliaciones Bancarias:</b>\n' +
      '<b>Hallazgo:</b> Se evidenció que no se entregó el Reporte de las Conciliaciones Bancarias.\n' +
      '<b>Descripción:</b> Incumplimiento a las Normas para la Formación, participación, rendición, examen y calificación de las cuentas de los órganos del Poder Público: Nacional, Estadal, Distrital, Municipal y sus entes descentralizados. Art.14 Formación antes del cierre de la Cuenta.',
  },
  q43_anexo_reporte_retenciones_pendientes: {
    pregunta:
      '¿El Acta de entrega tiene como anexo: Reportes de Retenciones de pagos pendientes por enterar correspondientes a ISLR, IVA  y Retenciones por Contratos (obras, bienes y servicios)  a la fecha del cese de funciones?',
    condicion:
      'SE EVIDENCIÓ QUE NO SE ENTREGÓ EL REPORTE DE RETENCIONES DE PAGOS PENDIENTES POR ENTERAR CORRESPONDIENTES A ISLR, IVA Y RETENCIONES POR CONTRATOS',
    criterio:
      'Normas para la Formación, participación, rendición, examen y calificación de las cuentas de los órganos del Poder Público: Nacional, Estadal,Distrital,Municipal y sus entes descentralizados.\nArt.14 Formación antes del cierre de la Cuenta.',
    observacionHtml:
      '<b>Reportes de Retenciones de pagos pendientes por enterar correspondientes a ISLR, IVA  y Retenciones por Contratos:</b>\n' +
      '<b>Hallazgo:</b> Se evidenció que no se entregó el Reporte de Retenciones de pagos pendientes por enterar correspondientes a ISLR, IVA y Retenciones por Contratos.\n' +
      '<b>Descripción:</b> Incumplimiento a las Normas para la Formación, participación, rendición, examen y calificación de las cuentas de los órganos del Poder Público: Nacional, Estadal, Distrital, Municipal y sus entes descentralizados.\nArt.14 Formación antes del cierre de la Cuenta.',
  },
  q44_anexo_reporte_contrataciones_publicas: {
    pregunta:
      '¿El Acta de entrega tiene como anexo: Reporte de los Procesos de Contrataciones Públicas  a la fecha del cese de funciones?',
    condicion:
      'SE EVIDENCIÓ QUE NO SE ENTREGÓ EL REPORTE DE LOS PROCESOS DE CONTRATACIONES PÚBLICAS',
    criterio:
      'Normas para la Formación, participación, rendición, examen y calificación de las cuentas de los órganos del Poder Público: Nacional, Estadal,Distrital,Municipal y sus entes descentralizados.\nArt.14 Formación antes del cierre de la Cuenta.',
    observacionHtml:
      '<b>Reporte de los Procesos de Contrataciones Públicas:</b>\n' +
      '<b>Hallazgo:</b> Se evidenció que no se entregó el Reporte de los Procesos de Contrataciones Públicas.\n' +
      '<b>Descripción:</b> Incumplimiento a las Normas para la Formación, participación, rendición, examen y calificación de las cuentas de los órganos del Poder Público: Nacional, Estadal, Distrital, Municipal y sus entes descentralizados.\nArt.14 Formación antes del cierre de la Cuenta.',
  },
  q45_anexo_reporte_fideicomiso_prestaciones: {
    pregunta:
      '¿El Acta de entrega tiene como anexo: Reporte del Fideicomiso de Prestaciones Sociales a la fecha del cese de funciones?',
    condicion:
      'SE EVIDENCIÓ QUE NO SE ENTREGÓ EL REPORTE DEL FIDEICOMISO DE PRESTACIONES SOCIALES',
    criterio:
      'Normas para la Formación, participación, rendición, examen y calificación de las cuentas de los órganos del Poder Público: Nacional, Estadal,Distrital,Municipal y sus entes descentralizados.\nArt.14 Formación antes del cierre de la Cuenta.',
    observacionHtml:
      '<b>Reporte del Fideicomiso de Prestaciones Sociales:</b>\n' +
      '<b>Hallazgo:</b> Se evidenció que no se entregó el Reporte del Fideicomiso de Prestaciones Sociales.\n' +
      '<b>Descripción:</b> Incumplimiento a las Normas para la Formación, participación, rendición, examen y calificación de las cuentas de los órganos del Poder Público: Nacional, Estadal, Distrital, Municipal y sus entes descentralizados.\nArt.14 Formación antes del cierre de la Cuenta.',
  },
  q46_anexo_reporte_bonos_vacacionales: {
    pregunta:
      '¿El Acta de entrega tiene como anexo: Reporte de Bonos Vacacionales  a la fecha del cese de funciones?',
    condicion:
      'SE EVIDENCIÓ QUE NO SE ENTREGÓ EL REPORTE DE BONOS VACACIONALES',
    criterio:
      'Normas para la Formación, participación, rendición, examen y calificación de las cuentas de los órganos del Poder Público: Nacional, Estadal,Distrital,Municipal y sus entes descentralizados.\nArt.14 Formación antes del cierre de la Cuenta',
    observacionHtml:
      '<b>Reporte de Bonos Vacacionales:</b>\n' +
      '<b>Hallazgo:</b> Se evidenció que no se entregó el Reporte de Bonos Vacacionales.\n' +
      '<b>Descripción:</b> Incumplimiento a las Normas para la Formación, participación, rendición, examen y calificación de las cuentas de los órganos del Poder Público: Nacional, Estadal,Distrital,Municipal y sus entes descentralizados.\nArt.14 Formación antes del cierre de la Cuenta.',
  },
  q47_anexo_mencion_numero_cargos_rrhh: {
    pregunta:
      '¿El Acta de entrega tiene como anexo: \nMención del número de cargos existentes, con señalamiento de sí son empleados u obreros, fijos o contratados, así como el número de jubilados y pensionados, de ser el caso a la fecha del cese de funciones?',
    condicion:
      'SE CONSTATÓ QUE NO CONTIENE ANEXO DE NÚMERO DE CARGOS EXISTENTES NI CONDICIÓN',
    criterio: 'ARTÍCULO 11.2 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Mención del número de cargos existentes, con señalamiento de sí son empleados u obreros, fijos o contratados, así como el número de jubilados y pensionados, de ser el caso:</b>\n' +
      '<b>Hallazgo:</b> Se constató que no contiene anexo de número de cargos existentes ni condición.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.2 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q48_incluye_cuadro_resumen_cargos: {
    pregunta:
      '¿Se Incluye un cuadro resumen indicando el número de cargos existentes, clasificados en empleados, obreros, fijos o contratados.?',
    condicion:
      'SE EVIDENCIÓ QUE NO SE ENTREGÓ CUADRO RESUMEN INDICANDO CARGOS Y CONDICIÓN',
    criterio: 'ARTÍCULO 11.2 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Se Incluye un cuadro resumen indicando el número de cargos existentes, clasificados en empleados, obreros, fijos o contratados:</b>\n' +
      '<b>Hallazgo:</b> Se evidenció que no se entregó cuadro resumen indicando cargos y condición.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.2 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q49_cuadro_resumen_cargos_validado_rrhh: {
    pregunta:
      '¿El cuadro resumen está validado por la Oficina de Recursos Humanos.?',
    condicion:
      'SE EVIDENCIÓ QUE EL  CUADRO RESUMEN INDICANDO CARGOS Y CONDICIÓN  NO ESTÁ VALIDADO POR LA OFICINA DE RECURSOS HUMANOS',
    criterio: 'ARTÍCULO 11.2 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>El cuadro resumen está validado por la Oficina de Recursos Humanos:</b>\n' +
      '<b>Hallazgo:</b> Se evidenció que el cuadro resumen indicando cargos y condición no está validado por la oficina de recursos humanos.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.2 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q50_anexo_reporte_nominas: {
    pregunta:
      '¿El Acta de entrega tiene como anexo: Reporte de Nóminas a la fecha del cese de funciones?',
    condicion: 'SE EVIDENCIÓ QUE NO SE ENTREGÓ EL REPORTE DE NÓMINAS',
    criterio:
      'Normas para la Formación, participación, rendición, examen y calificación de las cuentas de los órganos del Poder Público: Nacional, Estadal,Distrital,Municipal y sus entes descentralizados.\nArt.14 Formación antes del cierre de la Cuenta.',
    observacionHtml:
      '<b>Reporte de Nóminas:</b>\n' +
      '<b>Hallazgo:</b> Se evidenció que no se entregó el Reporte de Nóminas\n' +
      '<b>Descripción:</b> Incumplimiento a las Normas para la Formación, participación, rendición, examen y calificación de las cuentas de los órganos del Poder Público: Nacional, Estadal, Distrital, Municipal y sus entes descentralizados.\nArt.14 Formación antes del cierre de la Cuenta',
  },
  q51_anexo_inventario_bienes: {
    pregunta:
      '¿El Acta de entrega tiene como anexo: Inventario de los Bienes Muebles o Inmuebles?',
    condicion: 'SE EVIDENCIÓ QUE NO CONTIENE EL ANEXO DE INVENTARIO DE BIENES',
    criterio: 'ARTÍCULO 11.3 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Inventario de los Bienes Muebles o Inmuebles:</b>\n' +
      '<b>Hallazgo:</b> No contiene el anexo de inventario de bienes.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.3 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q52_inventario_bienes_fecha_entrega: {
    pregunta:
      '¿El inventario de Bienes e Inmuebles está elaborado a la fecha de entrega?',
    condicion:
      'SE CONSTATÓ QUE EL ANEXO DE INVENTARIO DE BIENES NO ESTÁ ELABORADO  A LA FECHA DE ENTREGA.',
    criterio: 'ARTÍCULO 11.3 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>El inventario de Bienes e Inmuebles está elaborado a la fecha de entrega:</b>\n' +
      '<b>Hallazgo:</b> Se constató que el anexo de inventario de bienes no está elaborado  a la fecha de entrega.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.3 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q53_inventario_bienes_comprobado_fisicamente: {
    pregunta: '¿El inventario de Bienes se comprobó físicamente?',
    condicion: 'NO SE CORROBORÓ EL ANEXO DE INVENTARIO DE BIENES FÍSICAMENTE',
    criterio: 'ARTÍCULO 11.3 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>El inventario de Bienes se comprobó físicamente, verificando su existencia y condición operativa.</b>\n' +
      '<b>Hallazgo:</b> No se corroboró el anexo de inventario de bienes físicamente.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.3 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q54_verificada_existencia_bienes_inventario: {
    pregunta:
      '¿Se verificó la existencia de los bienes descritos en el inventario?',
    condicion:
      'NO SE CORROBORÓ EL ANEXO DE LA EXISTENCIA DE LOS BIENES DESCRITOS EN EL INVENTARIO',
    criterio: 'ARTÍCULO 11.3 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Se verificó la existencia de los bienes descritos en el inventario:</b>\n' +
      '<b>Hallazgo:</b> No se corroboró el anexo de la existencia de los bienes descritos en el inventario.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.3 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q55_verificada_condicion_bienes_inventario: {
    pregunta:
      '¿Se verificó la condición de los bienes descritos en el inventario?',
    condicion:
      'NO SE CORROBORÓ EL ANEXO DE LA CONDICIÓN DE LOS BIENES DESCRITOS EN EL INVENTARIO',
    criterio: 'ARTÍCULO 11.3 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Se verificó la condición de los bienes descritos en el inventario:</b>\n' +
      '<b>Hallazgo:</b> No se corroboró el anexo de la condición de los bienes descritos en el inventario\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.3 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q56_inventario_indica_responsable_patrimonial: {
    pregunta: '¿Indica quién es el responsable patrimonial?',
    condicion: 'NO SE INDICÓ QUIÉN ES EL RESPONSABLE PATRIMONIAL',
    criterio:
      'ARTÍCULO 1. Providencia Administrativa N° 044 de fecha 03 de agosto 2018 Normativas sobre la Unidad de Bienes Públicos y el Responsable patrimonial de los Órganos y Entes del Sector Público.',
    observacionHtml:
      '<b>Indica quién es el responsable patrimonial.</b>\n' +
      '<b>Hallazgo:</b> No se Indica quién es el responsable patrimonial.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 1. Providencia Administrativa N° 044 de fecha 03 de agosto 2018 Normativas sobre la Unidad de Bienes Públicos y el Responsable patrimonial de los Órganos y Entes del Sector Público.',
  },
  q57_inventario_indica_responsable_uso: {
    pregunta: '¿Indica quién es el responsable patrimonial por uso?',
    condicion: 'NO SE INDICÓ QUIÉN ES EL RESPONSABLE PATRIMONIAL POR USO',
    criterio:
      'ARTÍCULO 6. Providencia Administrativa N° 044 de fecha 03 de agosto de 2018. Normativas sobre la Unidad de Bienes Públicos y el Responsable patrimonial de los Órganos y Entes del Sector Público.',
    observacionHtml:
      '<b>Indica quién es el responsable patrimonial por uso:</b>\n' +
      '<b>Hallazgo:</b> No se Indica quién es el responsable patrimonial por uso.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 6. Providencia Administrativa N° 044 de fecha 03 de agosto de 2018. Normativas sobre la Unidad de Bienes Públicos y el Responsable patrimonial de los Órganos y Entes del Sector Público.',
  },
  q58_inventario_indica_fecha_verificacion: {
    pregunta: '¿Indica la fecha de la verificación del inventario?',
    condicion: 'NO SE INDICÓ LA FECHA DE LA VERIFICACIÓN DEL INVENTARIO',
    criterio:
      'ARTÍCULO 12. Providencia Administrativa N° 041 de fecha 25 de junio de 2018. Instructivo del sistema de Información del Registro de Bienes Públicos de la Superintendencia de Bienes Públicos.',
    observacionHtml:
      '<b>Indica la fecha de la verificación del inventario.</b>\n' +
      '<b>Hallazgo:</b> No se Indica la fecha de la verificación del inventario.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 12. Providencia Administrativa N° 041 de fecha 25 de junio de 2018. Instructivo del sistema de Información del Registro de Bienes Públicos de la Superintendencia de Bienes Públicos.',
  },
  q59_inventario_indica_numero_acta_verificacion: {
    pregunta: '¿Indica  el número del acta de verificación?',
    condicion: 'NO SE INDICO EL NÚMERO DEL ACTA DE VERIFICACIÓN',
    criterio:
      'ARTÍCULO 3.7  Providencia Administrativa N° 041 de fecha 25 de junio de 2018. Instructivo del sistema de Información del Registro de Bienes Públicos de la Superintendencia de Bienes Públicos.',
    observacionHtml:
      '<b>Indica  el número del acta de verificación:</b>\n' +
      '<b>Hallazgo:</b> No se Indica  el número del acta de verificación\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 3.7  Providencia Administrativa N° 041 de fecha 25 de junio de 2018. Instructivo del sistema de Información del Registro de Bienes Públicos de la Superintendencia de Bienes Públicos.',
  },
  q60_inventario_indica_numero_registro_bien: {
    pregunta: '¿Indica el número de registro del bien?',
    condicion: 'NO SE INDICO EL NÚMERO DE REGISTRO DEL BIEN',
    criterio:
      'ARTÍCULO 3.7 Providencia Administrativa N° 041 de fecha 25 de junio de 2018. Instructivo del sistema de Información del Registro de Bienes Públicos de la Superintendencia de Bienes Públicos.',
    observacionHtml:
      '<b>Indica el número de registro del bien:</b>\n' +
      '<b>Hallazgo:</b> No se Indica el número de registro del bien.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 3.7 Providencia Administrativa N° 041 de fecha 25 de junio de 2018. Instructivo del sistema de Información del Registro de Bienes Públicos de la Superintendencia de Bienes Públicos.',
  },
  q61_inventario_indica_codigo_bien: {
    pregunta: '¿Indica el código del bien?',
    condicion: 'NO SE INDICO EL CÓDIGO DEL BIEN',
    criterio:
      'ARTÍCULOS 10 y 11. Providencia Administrativa N° 041 de fecha 25 de junio de 2018. Instructivo del sistema de Información del Registro de Bienes Públicos de la Superintendencia de Bienes Públicos.',
    observacionHtml:
      '<b>Indica el código del bien:</b>\n' +
      '<b>Hallazgo:</b> No se Indica el código del bien.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULOS 10 y 11. Providencia Administrativa N° 041 de fecha 25 de junio de 2018. Instructivo del sistema de Información del Registro de Bienes Públicos de la Superintendencia de Bienes Públicos.',
  },
  q62_inventario_indica_descripcion_bien: {
    pregunta: '¿Indica la descripción del bien?',
    condicion: 'NO SE INDICO LA DESCRIPCIÓN DEL BIEN',
    criterio:
      'ARTÍCULO 10. Providencia Administrativa N° 041 de fecha 25 de junio de 2018. Instructivo del sistema de Información del Registro de Bienes Públicos de la Superintendencia de Bienes Públicos.',
    observacionHtml:
      '<b>Indica la descripción del bien:</b>\n' +
      '<b>Hallazgo:</b> No se Indica la descripción del bien.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 10. Providencia Administrativa N° 041 de fecha 25 de junio de 2018. Instructivo del sistema de Información del Registro de Bienes Públicos de la Superintendencia de Bienes Públicos.',
  },
  q63_inventario_indica_marca_bien: {
    pregunta: '¿Se indica la marca del bien?',
    condicion: 'NO SE INDICO LA MARCA DEL BIEN',
    criterio: 'ARTÍCULO 11.3 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Indica la marca del bien:</b>\n' +
      '<b>Hallazgo:</b> No se Indica la marca del bien.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.3 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q64_inventario_indica_modelo_bien: {
    pregunta: '¿Se indica el modelo del bien?',
    condicion: 'NO SE INDICO EL MODELO DEL BIEN',
    criterio: 'ARTÍCULO 11.3 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Indica el modelo del bien:</b>\n' +
      '<b>Hallazgo:</b> No se Indica el modelo del bien.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.3 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q65_inventario_indica_serial_bien: {
    pregunta: '¿Se indica el número de serial del bien?',
    condicion: 'NO SE INDICO EL NÚMERO DE SERIAL DEL BIEN',
    criterio: 'ARTÍCULO 11.3 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Indica el número de serial del bien:</b>\n' +
      '<b>Hallazgo:</b> No se Indica el número de serial del bien.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.3 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q66_inventario_indica_estado_conservacion_bien: {
    pregunta: '¿Se indica el estado de conservación del bien para cada caso?',
    condicion: 'NO SE INDICO EL ESTADO DE CONSERVACIÓN DEL BIEN PARA CADA CASO',
    criterio: 'ARTÍCULO 11.3 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Indica el estado de conservación del bien para cada caso:</b>\n' +
      '<b>Hallazgo:</b> No se Indica el estado de conservación del bien para cada caso.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.3 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q67_inventario_indica_ubicacion_bien: {
    pregunta:
      '¿Se indica la ubicación del bien (Administrativa y/ o geográficamente)?',
    condicion:
      'NO SE INDICO LA UBICACIÓN DEL BIEN (ADMINISTRATIVA Y/O GEOGRÁFICAMENTE',
    criterio: 'ARTÍCULO 11.3 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Indica la ubicación del bien (Administrativa y/ o geográficamente):</b>\n' +
      '<b>Hallazgo:</b> No se Indica la ubicación del bien (Administrativa y/ o geográficamente)\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.3 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q68_inventario_indica_valor_mercado_bien: {
    pregunta: '¿Se indica el valor de mercado actualizado del bien?',
    condicion: 'NO SE INDICO EL VALOR DE MERCADO ACTUALIZADO DEL BIEN',
    criterio: 'ARTÍCULO 11.3 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Indica el valor de mercado actualizado del bien:</b>\n' +
      '<b>Hallazgo:</b> No se Indica el valor de mercado actualizado del bien.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.3 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q69_anexo_ejecucion_poa: {
    pregunta:
      '¿El Acta de entrega tiene como anexo: La ejecución del Plan Operativo Anual de conformidad con los objetivos propuestos y las metas fijadas en el presupuesto?',
    condicion: 'SE EVIDENCIÓ QUE NO SE ENTREGÓ EJECUCIÓN DEL PLAN OPERATIVO',
    criterio: 'ARTÍCULO 11.4 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>La ejecución del Plan Operativo Anual de conformidad con los objetivos propuestos y las metas fijadas en el presupuesto:</b>\n' +
      '<b>Hallazgo:</b> Se evidenció que no se entregó ejecución del plan operativo.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.4 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q70_incluye_ejecucion_poa_fecha_entrega: {
    pregunta:
      '¿Se incluye la ejecución del Plan Operativo a la fecha de entrega?',
    condicion:
      'NO SE ENTREGÓ EJECUCIÓN DEL PLAN OPERATIVO A LA FECHA DE ENTREGA',
    criterio: 'ARTÍCULO 11.4 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Se incluye la ejecución del Plan Operativo a la fecha de entrega:</b>\n' +
      '<b>Hallazgo:</b> No se entregó ejecución del plan operativo a la fecha de entrega\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.4 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q71_incluye_causas_incumplimiento_metas_poa: {
    pregunta:
      '¿Se incluyen detalles de las causas que originaron el incumplimiento de algunas metas?',
    condicion:
      'NO SE DETALLARON LA CAUSAS DEL INCUMPLIMIENTO DE LA  EJECUCIÓN DEL PLAN OPERATIVO',
    criterio: 'ARTÍCULO 11.4 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Se incluyen detalles de las  causas que originaron el incumpliento de algunas metas:</b>\n' +
      '<b>Hallazgo:</b> No se detallaron las causas del incumplimiento de la  ejecución del plan operativo.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.4 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q72_incluye_plan_operativo_anual: {
    pregunta: '¿Se incluye el Plan Operativo Anual?',
    condicion:
      'SE EVIDENCIÓ QUE NO SE ENTREGÓ EJECUCIÓN DEL PLAN OPERATIVO ANUAL',
    criterio: 'ARTÍCULO 11.4 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Se incluye el Plan Operativo Anual.</b>\n' +
      '<b>Hallazgo:</b> Se evidenció que no se entregó ejecución del plan operativo anual.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.4 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q73_anexo_indice_general_archivo: {
    pregunta:
      '¿El Acta de entrega tiene como anexo: El Índice general del archivo?',
    condicion:
      'SE EVIDENCIÓ QUE NO CONTIENE EL ANEXO DE ÍNDICE GENERAL DE ARCHIVO',
    criterio: 'ARTÍCULO 11.5 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>El Índice general del archivo:</b>\n' +
      '<b>Hallazgo:</b> Se evidenció que no contiene el anexo de índice general de archivo.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.5 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q74_archivo_indica_clasificacion: {
    pregunta: '¿Se  indicó la clasificación del archivo?',
    condicion: 'NO SE EVIDENCIO EL ANEXO DE CLASIFICACIÓN DEL ARCHIVO',
    criterio: 'ARTÍCULO 11.5 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Se  indicó la clasificación del archivo.</b>\n' +
      '<b>Hallazgo:</b> No se evidencio el anexo de clasificación del archivo.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.5 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q75_archivo_indica_ubicacion_fisica: {
    pregunta: '¿Se indica ubicación física?',
    condicion: 'NO SE CORROBORÓ LA UBICACIÓN FÍSICA DEL ARCHIVO',
    criterio: 'ARTÍCULO 11.5 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Se indica ubicación física.</b>\n' +
      '<b>Hallazgo:</b> No se corroboró la ubicación física del archivo.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 11.5 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q76_incluye_relacion_montos_fondos_asignados: {
    pregunta: '¿Se incluye Relación de los montos de los fondos asignados?',
    condicion: 'NO SE EVIDENCIÓ RELACIÓN DE LOS MONTOS DE LOS FONDOS ASIGNADOS',
    criterio:
      'Reglamento Nº 1 de la Ley Orgánica de la Administración Financiera del Sector Público sobre el Sistema Presupuestario. Art. 53',
    observacionHtml:
      '<b>Se incluye Relación de los montos de los fondos asignados:</b>\n' +
      '<b>Hallazgo:</b> no se evidenció relación de los montos de los fondos asignados.\n' +
      '<b>Descripción:</b> Incumplimiento al Reglamento Nº 1 de la Ley Orgánica de la Administración Financiera del Sector Público sobre el Sistema Presupuestario.\nArt. 53.',
  },
  q77_incluye_saldo_efectivo_fondos: {
    pregunta: '¿Se incluye Saldo en efectivo de dichos fondos.?',
    condicion: 'NO SE EVIDENCIÓ SALDO EN EFECTIVO DE DICHOS FONDOS',
    criterio:
      'Reglamento Nº 1 de la Ley Orgánica de la Administración Financiera del Sector Público sobre el Sistema Presupuestario. Art. 53',
    observacionHtml:
      '<b>Se incluye Saldo en efectivo de dichos fondos:</b>\n' +
      '<b>Hallazgo:</b> No se evidenció saldo en efectivo de dichos fondos.\n' +
      '<b>Descripción:</b> Incumplimiento al Reglamento Nº 1 de la Ley Orgánica de la Administración Financiera del Sector Público sobre el Sistema Presupuestario.\nArt. 53.',
  },
  q78_incluye_relacion_bienes_asignados: {
    pregunta: '¿Se incluye Relación de los bienes asignados?',
    condicion: 'NO SE EVIDENCIÓ RELACIÓN DE LOS BIENES ASIGNADOS',
    criterio:
      'Reglamento Nº 1 de la Ley Orgánica de la Administración Financiera del Sector Público sobre el Sistema Presupuestario. Art. 53.',
    observacionHtml:
      '<b>Se incluye Relación de los bienes asignados.</b>\n' +
      '<b>Hallazgo:</b> no se evidenció relación de los bienes asignados.\n' +
      '<b>Descripción:</b> Incumplimiento al Reglamento Nº 1 de la Ley Orgánica de la Administración Financiera del Sector Público sobre el Sistema Presupuestario.\nArt. 53.',
  },
  q79_incluye_relacion_bienes_unidad_bienes: {
    pregunta:
      '¿Se incluye Relación de los Bienes asignados emitida por la Unidad de Bienes?',
    condicion:
      'NO SE EVIDENCIÓ RELACIÓN DE LOS BIENES ASIGNADOS EMITIDA POR LA UNIDAD DE BIENES',
    criterio:
      'Reglamento Nº 1 de la Ley Orgánica de la Administración Financiera del Sector Público sobre el Sistema Presupuestario. Art. 53.',
    observacionHtml:
      '<b>Se incluye Relación de los Bienes asignados emitida por la Unidad de Bienes:</b>\n' +
      '<b>Hallazgo:</b> No se evidenció relación de los bienes asignados emitida por la unidad de bienes.\n' +
      '<b>Descripción:</b> Incumplimiento al Reglamento Nº 1 de la Ley Orgánica de la Administración Financiera del Sector Público sobre el Sistema Presupuestario.\nArt. 53.',
  },
  q80_incluye_estados_bancarios_conciliados: {
    pregunta:
      '¿Se incluye Estados bancarios actualizados y conciliados a la fecha de entrega?',
    condicion:
      'NO SE EVIDENCIÓ ESTADOS BANCARIOS ACTUALIZADOS Y CONCILIADOS A LA FECHA DE ENTREGA',
    criterio:
      'Reglamento Nº 1 de la Ley Orgánica de la Administración Financiera del Sector Público sobre el Sistema Presupuestario. Art. 53.',
    observacionHtml:
      '<b>Se incluye Estados bancarios actualizados y conciliados a la fecha de entrega:</b>\n' +
      '<b>Hallazgo:</b> No se evidenció estados bancarios actualizados y conciliados a la fecha de entrega.\n' +
      '<b>Descripción:</b> Incumplimiento al Reglamento Nº 1 de la Ley Orgánica de la Administración Financiera del Sector Público sobre el Sistema Presupuestario.\nArt. 53.',
  },
  q81_incluye_lista_comprobantes_gastos: {
    pregunta: '¿Se incluye lista de comprobantes de gastos?',
    condicion: 'NO SE EVIDENCIÓ LISTA DE COMPROBANTES DE GASTOS.',
    criterio:
      'Reglamento Nº 1 de la Ley Orgánica de la Administración Financiera del Sector Público sobre el Sistema Presupuestario. Art. 53',
    observacionHtml:
      '<b>Se incluye lista de comprobantes de gastos:</b>\n' +
      '<b>Hallazgo:</b> No se evidenció lista de comprobantes de gastos.\n' +
      '<b>Descripción:</b> Incumplimiento al Reglamento Nº 1 de la Ley Orgánica de la Administración Financiera del Sector Público sobre el Sistema Presupuestario.\nArt. 53.',
  },
  q82_incluye_cheques_pendientes_cobro: {
    pregunta: '¿Se incluyen Cheques emitidos pendientes de cobro?',
    condicion: 'NO SE EVIDENCIÓ CHEQUES EMITIDOS PENDIENTES DE COBRO.',
    criterio:
      'Reglamento Nº 1 de la Ley Orgánica de la Administración Financiera del Sector Público sobre el Sistema Presupuestario. Art. 53.',
    observacionHtml:
      '<b>Se incluyen Cheques emitidos pendientes de cobro:</b>\n' +
      '<b>Hallazgo:</b> No se evidenció cheques emitidos pendientes de cobro.\n' +
      '<b>Descripción:</b> Incumplimiento al Reglamento Nº 1 de la Ley Orgánica de la Administración Financiera del Sector Público sobre el Sistema Presupuestario.\nArt. 53.',
  },
  q83_incluye_reporte_transferencias_bancarias: {
    pregunta: '¿Se incluyen  listado o reporte de Transferencia Bancaria?',
    condicion: 'NO SE EVIDENCIÓ LISTADO O REPORTE DE TRANSFERENCIA BANCARIA',
    criterio:
      'Reglamento Nº 1 de la Ley Orgánica de la Administración Financiera del Sector Público sobre el Sistema Presupuestario. Art. 53.',
    observacionHtml:
      '<b>Se incluyen  listado o reporte de Transferencia Bancaria:</b>\n' +
      '<b>Hallazgo:</b> No se evidenció listado o reporte de transferencia bancaria.\n' +
      '<b>Descripción:</b> Incumplimiento al Reglamento Nº 1 de la Ley Orgánica de la Administración Financiera del Sector Público sobre el Sistema Presupuestario.\nArt. 53.',
  },
  q84_anexo_caucion_funcionario_admin: {
    pregunta:
      '¿El Acta de entrega tiene como anexo: Caución del funcionario encargado de la Administración de los Recursos Financieros a la fecha del cese de funciones?',
    condicion:
      'NO SE EVIDENCIÓ LA CAUCIÓN DEL FUNCIONARIO ENCARGADO DE LA ADMINISTRACIÓN DE LOS RECURSOS FINANCIEROS.',
    criterio:
      'Reglamento Nº 1 de la Ley Orgánica de la Administración Financiera del Sector Público sobre el Sistema Presupuestario. Art. 53.',
    observacionHtml:
      '<b>Caución del funcionario encargado de la Administración de los Recursos Financieros:</b>\n' +
      '<b>Hallazgo:</b> No se evidenció la Caución del funcionario encargado de la Administración de los Recursos Financieros.\n' +
      '<b>Descripción:</b> Incumplimiento al Reglamento Nº 1 de la Ley Orgánica de la Administración Financiera del Sector Público sobre el Sistema Presupuestario.\nArt. 53.',
  },
  q85_incluye_cuadro_liquidado_recaudado: {
    pregunta:
      '¿Se incluye cuadro demostrativo del detalle de lo liquidado y recaudado por los rubros respectivos, y de los derechos pendientes de recaudación de años anteriores?',
    condicion:
      'NO SE EVIDENCIÓ  CUADRO DEMOSTRATIVO DEL DETALLE DE LO LIQUIDADO Y RECAUDADO POR LOS RUBROS RESPECTIVOS, Y DE LOS DERECHOS PENDIENTES DE RECAUDACIÓN DE AÑOS ANTERIORES.',
    criterio: 'Artículo 13 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Se incluye cuadro demostrativo del detalle de lo liquidado y recaudado por los rubros respectivos, y de los derechos pendientes de recaudación de años anteriores:</b>\n' +
      '<b>Hallazgo:</b> No se evidenció  cuadro demostrativo del detalle de lo liquidado y recaudado por los rubros respectivos, y de los derechos pendientes de recaudación de años anteriores.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 13 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q86_incluye_relacion_expedientes_investigacion: {
    pregunta:
      '¿Se incluye relación de los expedientes abiertos con ocasión del ejercicio de la potestad de investigación, así como de los procedimientos administrativos para la determinación de responsabilidades?',
    condicion:
      'NO SE EVIDENCIÓ RELACIÓN DE LOS EXPEDIENTES ABIERTOS CON OCASIÓN DEL EJERCICIO DE LA POTESTAD DE INVESTIGACIÓN, ASÍ COMO DE LOS PROCEDIMIENTOS ADMINISTRATIVOS PARA LA DETERMINACIÓN DE RESPONSABILIDADES.',
    criterio:
      'Artículo 14 Resolución CGR N.º 01-000162 de fecha 27-07-2009 y el Título III Artículos 53 y 54 de la Ley Orgánica de la Contraloría General de la República y del Sistema Nacional de Control Fiscal',
    observacionHtml:
      '<b>Se incluye relación de los expedientes abiertos con ocasión del ejercicio de la potestad de investigación, así como de los procedimientos administrativos para la determinación de responsabilidades:</b>\n' +
      '<b>Hallazgo:</b> No se evidenció relación de los expedientes abiertos con ocasión del ejercicio de la potestad de investigación, así como de los procedimientos administrativos para la determinación de responsabilidades.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 14 Resolución CGR N.º 01-000162 de fecha 27-07-2009 y el Título III Artículos 53 y 54 de la Ley Orgánica de la Contraloría General de la República y del Sistema Nacional de Control Fiscal.',
  },
  q87_incluye_situacion_tesoro_nacional: {
    pregunta: '¿Se incluye Situación del Tesoro Nacional.?',
    condicion:
      'NO SE EVIDENCIÓ INFORMACIÓN  SOBRE LA SITUACIÓN DEL TESORO NACIONAL.',
    criterio: 'Artículo 15 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
    observacionHtml:
      '<b>Se incluye Situación del Tesoro Nacional:</b>\n' +
      '<b>Hallazgo:</b> No se evidenció información  sobre la situación del tesoro nacional.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 15 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q88_incluye_ejecucion_presupuesto_nacional: {
    pregunta:
      '¿Se incluye información de la ejecución del presupuesto nacional de ingresos y egresos del ejercicio presupuestario en curso y de los derechos pendientes de recaudación de años anteriores.?',
    condicion:
      'NO SE EVIDENCIÓ INFORMACIÓN  SOBRE  LA EJECUCIÓN DEL PRESUPUESTO NACIONAL DE INGRESOS Y EGRESOS DEL EJERCICIO PRESUPUESTARIO EN CURSO Y DE LOS DERECHOS PENDIENTES DE RECAUDACIÓN DE AÑOS ANTERIORES.',
    criterio: 'Artículo 15 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Se incluye información de la ejecución del presupuesto nacional de ingresos y egresos del ejercicio presupuestario en curso y de los derechos pendientes de recaudación de años anteriores.:</b>\n' +
      '<b>Hallazgo:</b> No se evidenció información  sobre  la ejecución del presupuesto nacional de ingresos y egresos del ejercicio presupuestario en curso y de los derechos pendientes de recaudación de años anteriores.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 15 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q89_incluye_monto_deuda_publica_nacional: {
    pregunta:
      '¿Se incluye Monto de la deuda pública nacional interna y externa.?',
    condicion:
      'NO SE EVIDENCIÓ INFORMACIÓN  SOBRE   LA DEUDA PÚBLICA NACIONAL INTERNA Y EXTERNA.',
    criterio: 'Artículo 15 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
    observacionHtml:
      '<b>Se incluye Monto de la deuda pública nacional interna y externa:</b>\n' +
      '<b>Hallazgo:</b> No se evidenció información  sobre   la deuda pública nacional interna y externa\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 15 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q90_incluye_situacion_cuentas_nacion: {
    pregunta: '¿Se incluye la Situación de las cuentas de la Nación?',
    condicion: 'NO SE EVIDENCIÓ INFORMACIÓN  SOBRE LAS CUENTAS DE LA NACIÓN.',
    criterio: 'Artículo 15 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Se incluye la Situación de las cuentas de la Nación.</b>\n' +
      '<b>Hallazgo:</b> No se evidenció información  sobre las cuentas de la nación.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 15 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q91_incluye_situacion_tesoro_estadal: {
    pregunta: '¿Se incluye Situación del Tesoro Estadal?',
    condicion:
      'NO SE EVIDENCIÓ INFORMACIÓN  SOBRE SITUACIÓN DEL TESORO ESTADAL',
    criterio: 'Artículo 16 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Se incluye Situación del Tesoro Estadal.</b>\n' +
      '<b>Hallazgo:</b> No se evidenció información  sobre situación del tesoro estadal.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 16 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q92_incluye_ejecucion_presupuesto_estadal: {
    pregunta:
      '¿Se incluye Información de la ejecución del presupuesto estadal de ingresos y egresos del ejercicio presupuestario en curso y de los derechos pendientes de recaudación de años anteriores.?',
    condicion:
      'NO SE EVIDENCIÓ INFORMACIÓN  SOBRE  LA EJECUCIÓN DEL PRESUPUESTO ESTADAL DE INGRESOS Y EGRESOS DEL EJERCICIO PRESUPUESTARIO EN CURSO Y DE LOS DERECHOS PENDIENTES DE RECAUDACIÓN DE AÑOS ANTERIORES.',
    criterio: 'Artículo 16 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Se incluye Información de la ejecución del presupuesto estadal de ingresos y egresos del ejercicio presupuestario en curso y de los derechos pendientes de recaudación de años anteriores:</b>\n' +
      '<b>Hallazgo:</b> No se evidenció información  sobre  la ejecución del presupuesto estadal de ingresos y egresos del ejercicio presupuestario en curso y de los derechos pendientes de recaudación de años anteriores.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 16 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q93_incluye_situacion_cuentas_estadal: {
    pregunta: '¿Se incluye Situación de las cuentas del respectivo estado?',
    condicion: 'NO SE INCLUYÓ SITUACIÓN DE LAS CUENTAS DEL RESPECTIVO ESTADO',
    criterio: 'Artículo 16 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Se incluye Situación de las cuentas del respectivo estado.</b>\n' +
      '<b>Hallazgo:</b> No se incluye Situación de las cuentas del respectivo estado.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 16 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q94_incluye_situacion_tesoro_municipal: {
    pregunta: '¿Se incluye Situación del Tesoro Distrital o Municipal?',
    condicion:
      'NO SE EVIDENCIÓ INFORMACIÓN SOBRE  LA SITUACIÓN DEL TESORO DISTRITAL O MUNICIPAL.',
    criterio: 'Artículo 17 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Se incluye Situación del Tesoro Distrital o Municipal:</b>\n' +
      '<b>Hallazgo:</b> No se evidenció información sobre  la situación del tesoro distrital o municipal.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 17 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q95_incluye_ejecucion_presupuesto_municipal: {
    pregunta:
      '¿Se incluye Información de la ejecución del presupuesto distrital o municipal de ingresos y egresos del ejercicio presupuestario en curso y de los derechos pendientes de recaudación de años anteriores?',
    condicion:
      'NO SE EVIDENCIÓ INFORMACIÓN  SOBRE  LA EJECUCIÓN DEL PRESUPUESTO ESTADAL DE INGRESOS Y EGRESOS DEL EJERCICIO PRESUPUESTARIO EN CURSO Y DE LOS DERECHOS PENDIENTES DE RECAUDACIÓN DE AÑOS ANTERIORES.',
    criterio: 'Artículo 16 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Se incluye Información de la ejecución del presupuesto estadal de ingresos y egresos del ejercicio presupuestario en curso y de los derechos pendientes de recaudación de años anteriores.</b>\n' +
      '<b>Hallazgo:</b> No se evidenció información  sobre  la ejecución del presupuesto estadal de ingresos y egresos del ejercicio presupuestario en curso y de los derechos pendientes de recaudación de años anteriores.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 16 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q96_incluye_situacion_cuentas_municipal: {
    pregunta:
      '¿Se incluye Situación de las cuentas distritales o municipales.?',
    condicion:
      'NO SE EVIDENCIÓ INFORMACIÓN SOBRE  LA SITUACIÓN DE LAS CUENTAS DISTRITALES O MUNICIPALES.',
    criterio: 'Artículo 17 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Se incluye Situación de las cuentas distritales o municipales:</b>\n' +
      '<b>Hallazgo:</b> No se evidenció información sobre  la situación de las cuentas distritales o municipales.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 17 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q97_incluye_inventario_terrenos_municipales: {
    pregunta:
      '¿Se incluye Inventario detallado de los terrenos ejidos y de los terrenos propios distritales o municipales.?',
    condicion:
      'NO SE EVIDENCIÓ INFORMACIÓN SOBRE INVENTARIO DETALLADO DE LOS TERRENOS EJIDOS Y DE LOS TERRENOS PROPIOS DISTRITALES O MUNICIPALES',
    criterio: 'Artículo 17 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Se incluye Inventario detallado de los terrenos ejidos y de los terrenos propios distritales o municipales:</b>\n' +
      '<b>Hallazgo:</b> No se evidenció información sobre inventario detallado de los terrenos ejidos y de los terrenos propios distritales o municipales.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 17 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
  },
  q98_incluye_relacion_ingresos_venta_terrenos: {
    pregunta:
      '¿Se incluye Relación de Ingresos producto de las ventas de terrenos ejidos o terrenos propios distritales o municipales?',
    condicion:
      'NO SE EVIDENCIÓ RELACIÓN DE INGRESOS PRODUCTO DE LAS VENTAS DE TERRENOS EJIDOS O TERRENOS PROPIOS DISTRITALES O MUNICIPALES.',
    criterio: 'Artículo 17 Resolución CGR N.º 01-000162 de fecha 27-07-2009',
    observacionHtml:
      '<b>Se incluye Relación de Ingresos producto de las ventas de terrenos ejidos o terrenos propios distritales o municipales.</b>\n' +
      '<b>Hallazgo:</b> No se evidenció relación de ingresos producto de las ventas de terrenos ejidos o terrenos propios distritales o municipales.\n' +
      '<b>Descripción:</b> Incumplimiento al ARTÍCULO 17 Resolución CGR N.º 01-000162 de fecha 27-07-2009.',
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
