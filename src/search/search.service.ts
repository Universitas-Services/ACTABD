import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SearchServiceClient } from '@google-cloud/discoveryengine';
import { PrismaService } from '../prisma/prisma.service';
import { FINDINGS_MAP } from '../acta-compliance/acta-compliance.constants';
import { VertexAI } from '@google-cloud/vertexai';

@Injectable()
export class SearchService {
  private client: SearchServiceClient;
  private geminiModel: any;
  private projectId = process.env.GOOGLE_PROJECT_ID;
  private location = process.env.VERTEX_LOCATION || 'global';
  private collectionId =
    process.env.VERTEX_COLLECTION_ID || 'default_collection';
  private dataStoreId = process.env.VERTEX_DATA_STORE_ID;

  constructor(private readonly prisma: PrismaService) {
    // El cliente buscará automáticamente la variable GOOGLE_APPLICATION_CREDENTIALS
    this.client = new SearchServiceClient();

    // Inicializar Vertex AI Generative AI (sin API Key, usa credenciales de Google Cloud)
    try {
      const vertexAI = new VertexAI({
        project: this.projectId,
        location: 'us-central1', // Vertex AI Generative AI requiere región específica
      });
      this.geminiModel = vertexAI.getGenerativeModel({
        model: 'gemini-2.0-flash-001',
      });
      console.log(
        '✅ Vertex AI Generative AI inicializado correctamente (us-central1)',
      );
    } catch (error) {
      console.error('❌ Error inicializando Vertex AI Generative AI:', error);
      this.geminiModel = null;
    }
  }

  async search(query: string) {
    if (!this.projectId || !this.dataStoreId) {
      throw new InternalServerErrorException(
        'Faltan configuraciones de Vertex AI en el .env',
      );
    }

    const servingConfig =
      this.client.projectLocationCollectionEngineServingConfigPath(
        this.projectId,
        this.location,
        this.collectionId,
        this.dataStoreId,
        'default_search',
      );

    const request = {
      pageSize: 5,
      query: query,
      servingConfig: servingConfig,
      contentSearchSpec: {
        snippetSpec: { returnSnippet: true },
      },
    };

    try {
      console.log(`🔎 Buscando en Vertex AI: "${query}"...`);
      const response = await this.client.search(request);

      const results = response[0];
      const rawResponse = response[2];
      const summary = rawResponse?.summary;

      const cleanResults = results.map((result) => {
        const doc = result.document;
        const data = doc?.derivedStructData as any;

        return {
          id: doc?.id,
          title: data?.title || 'Documento sin título',
          link: data?.link || '',
          snippet: data?.snippets?.[0]?.snippet || '',
          pageNumber: data?.extractiveSegments?.[0]?.pageNumber || null,
        };
      });

      return {
        ai_summary: summary?.summaryText || null,
        documents: cleanResults,
      };
    } catch (error) {
      console.error('❌ Error en Vertex AI Search:', error);
      throw new InternalServerErrorException(
        'Error al consultar la base de conocimiento legal',
      );
    }
  }

  async analyzeActa(actaId: string) {
    const acta = await this.prisma.acta.findUnique({
      where: { id: actaId },
    });

    if (!acta) {
      throw new InternalServerErrorException('No se encontró el Acta');
    }

    const hallazgosDetectados: any[] = [];
    const metadata = acta.metadata as any;

    if (!metadata) {
      return {
        total_hallazgos: 0,
        analisis: [],
        mensaje: 'El acta no tiene metadata para analizar',
      };
    }

    const METADATA_MAPPING: Record<string, string> = {
      disponeInventarioBienes: 'q51_anexo_inventario_bienes',
      disponeEstadosFinancieros: 'q28_anexo_estados_financieros',
      disponePlanOperativoAnual: 'q72_incluye_plan_operativo_anual',
      disponeSituacionCajaChica: 'q37_anexo_situacion_caja_chica',
      disponeBalanceComprobacion: 'q29_anexo_balance_comprobacion_y_notas',
      disponeCuadroResumenCargos: 'q48_incluye_cuadro_resumen_cargos',
      disponeReportesRetenciones: 'q43_anexo_reporte_retenciones_pendientes',
      disponeClasificacionArchivo: 'q74_archivo_indica_clasificacion',
      disponeActaArqueoCajasChicas: 'q38_anexo_acta_arqueo_caja_chica',
      disponeEjecucionPlanOperativo: 'q69_anexo_ejecucion_poa',
      incluyeUbicacionFisicaArchivo: 'q75_archivo_indica_ubicacion_fisica',
      disponeRelacionCuentasPorPagar: 'q34_anexo_relacion_cuentas_por_pagar',
      disponeReportesLibrosContables: 'q40_anexo_reporte_libros_contables',
      disponeSituacionFondosAnticipo: 'q36_anexo_situacion_fondos_anticipo',
      disponeRelacionCuentasPorCobrar: 'q33_anexo_relacion_cuentas_por_cobrar',
      disponeReporteBonosVacacionales: 'q46_anexo_reporte_bonos_vacacionales',
      disponeReportesCuentasBancarias: 'q41_anexo_reporte_cuentas_bancarias',
      disponeCuadroResumenValidadoRRHH:
        'q49_cuadro_resumen_cargos_validado_rrhh',
      disponeEstadoSituacionFinanciera:
        'q30_anexo_estado_situacion_financiera_y_notas',
      incluyeCausasIncumplimientoMetas:
        'q71_incluye_causas_incumplimiento_metas_poa',
      disponeEstadoMovimientosPatrimonio:
        'q32_anexo_estado_movimiento_patrimonio_y_notas',
      disponeEstadoRendimientoFinanciero:
        'q31_anexo_estado_rendimiento_financiero_y_notas',
      disponeEstadoSituacionPresupuestaria:
        'q23_anexo_situacion_presupuestaria_detallada',
      disponeRelacionCuentasFondosTerceros:
        'q35_anexo_relacion_fondos_terceros',
      disponeReporteProcesosContrataciones:
        'q44_anexo_reporte_contrataciones_publicas',
      disponeReporteFideicomisoPrestaciones:
        'q45_anexo_reporte_fideicomiso_prestaciones',
      disponeEstadoPresupuestarioPorPartidas:
        'q26_anexo_estado_presupuestario_por_partidas',
      disponeReportesConciliacionesBancarias:
        'q42_anexo_reporte_conciliaciones_bancarias',
      disponeEstadoPresupuestarioDetalleCuentas:
        'q27_anexo_estado_presupuestario_por_cuentas',
      disponeListadoRegistroAuxiliarProveedores:
        'q39_anexo_listado_registro_proveedores',
      disponeRelacionGastosComprometidosNoCausados:
        'q24_anexo_gastos_comprometidos_no_causados',
      disponeRelacionGastosComprometidosCausadosNoPagados:
        'q25_anexo_gastos_causados_no_pagados',
    };

    for (const [metadataKey, findingKey] of Object.entries(METADATA_MAPPING)) {
      const respuesta = metadata[metadataKey];

      if (respuesta === 'NO') {
        const findingData = FINDINGS_MAP[findingKey];

        if (findingData) {
          const query = `Justificación legal para: ${findingData.pregunta} según ${findingData.criterio}`;
          const vertexResult = await this.search(query);

          let geminiObservation: string | null = null;
          if (vertexResult.documents && vertexResult.documents.length > 0) {
            try {
              geminiObservation = await this.generateLegalJustification(
                findingData.pregunta,
                vertexResult.documents,
              );

              await new Promise((resolve) => setTimeout(resolve, 12000));
            } catch (error) {
              console.error('Error generando observación con Gemini:', error);
              geminiObservation =
                'No se pudo generar la observación automática.';
            }
          }

          hallazgosDetectados.push({
            dato_faltante: metadataKey,
            pregunta: findingData.pregunta,
            condicion: findingData.condicion,
            criterio: findingData.criterio,
            respuesta: respuesta,
            observacion_legal: geminiObservation,
            // NO guardamos documentos_soporte para ahorrar espacio en BD
          });
        }
      }
    }

    return {
      total_hallazgos: hallazgosDetectados.length,
      analisis: hallazgosDetectados,
    };
  }

  private async generateLegalJustification(
    question: string,
    documents: any[],
  ): Promise<string | null> {
    if (!this.geminiModel) {
      console.warn('⚠️ Gemini Model no inicializado. Saltando generación.');
      return null;
    }

    const context = documents
      .map(
        (doc) =>
          `Título: ${doc.title}\nContenido: ${doc.snippet}\nLink: ${doc.link}`,
      )
      .join('\n\n');

    const prompt = `
Actúa como un Asistente de IA experto en normativa de administración pública de Venezuela, especializado en actas de entrega conforme a la Ley Orgánica de la Contraloría General de la República.

Analiza la respuesta negativa ("NO") a: "${question}"

Genera una observación técnica CONCISA Y DIRECTA con exactamente estos 5 puntos (máximo 2-3 líneas por punto):

1. **Identificación del Anexo Faltante:** Indica brevemente qué documento o información falta.
2. **Importancia del Documento:** Explica en 2-3 líneas por qué es fundamental para la continuidad administrativa, transparencia y rendición de cuentas.
3. **Fundamento Legal:** Cita únicamente el/los artículo(s) específico(s) de la Resolución CGR N.º 01-00-000162 que lo exigen.
4. **Implicaciones Legales:**
   - **Funcionario Saliente:** Riesgo de responsabilidad administrativa y presunción de daño patrimonial (cita el artículo del Reglamento).
   - **Funcionario Entrante:** Deber de dejar constancia en 120 días hábiles o asume corresponsabilidad.
   - **Máxima Autoridad:** Responsabilidad de supervisión y custodia del acta.
5. **Acción Correctiva:** Lista en máximo 3-4 pasos concretos para subsanar la omisión.

IMPORTANTE: Sé BREVE, CLARO y PROFESIONAL. Evita repeticiones y texto innecesario.

---CONTEXTO---
${context}
---FIN DEL CONTEXTO---
        `;

    try {
      const result = await this.geminiModel.generateContent(prompt);
      const response = result.response;

      if (response.candidates && response.candidates.length > 0) {
        const candidate = response.candidates[0];
        if (
          candidate.content &&
          candidate.content.parts &&
          candidate.content.parts.length > 0
        ) {
          return candidate.content.parts[0].text;
        }
      }

      console.warn('⚠️ No se pudo extraer texto de la respuesta de Vertex AI');
      return null;
    } catch (error) {
      console.error('Error invocando Gemini API:', error);
      throw error;
    }
  }

  // ==================== MÉTODOS DE PERSISTENCIA ====================

  async analyzeAndSave(actaId: string) {
    const resultado = await this.analyzeActa(actaId);

    const observacion = await this.prisma.actaObservacion.create({
      data: {
        actaId: actaId,
        totalHallazgos: resultado.total_hallazgos,
        analisis: resultado.analisis as any,
      },
    });

    return {
      id: observacion.id,
      actaId: observacion.actaId,
      totalHallazgos: observacion.totalHallazgos,
      analisis: observacion.analisis,
      createdAt: observacion.createdAt,
    };
  }

  async getObservaciones(actaId: string) {
    const observacion = await this.prisma.actaObservacion.findFirst({
      where: { actaId },
      orderBy: { createdAt: 'desc' },
    });

    if (!observacion) {
      throw new InternalServerErrorException(
        'No se encontraron observaciones para esta acta',
      );
    }

    return {
      id: observacion.id,
      actaId: observacion.actaId,
      totalHallazgos: observacion.totalHallazgos,
      analisis: observacion.analisis,
      createdAt: observacion.createdAt,
    };
  }

  async regenerarObservaciones(actaId: string) {
    // 1. Generar nuevas observaciones
    const resultado = await this.analyzeActa(actaId);

    // 2. Buscar si ya existe una observación para esta acta
    const observacionExistente = await this.prisma.actaObservacion.findFirst({
      where: { actaId },
      orderBy: { createdAt: 'desc' },
    });

    if (observacionExistente) {
      // 3. Actualizar la observación existente (UPDATE)
      const observacionActualizada = await this.prisma.actaObservacion.update({
        where: { id: observacionExistente.id },
        data: {
          totalHallazgos: resultado.total_hallazgos,
          analisis: resultado.analisis as any,
          updatedAt: new Date(),
        },
      });

      return {
        id: observacionActualizada.id,
        actaId: observacionActualizada.actaId,
        totalHallazgos: observacionActualizada.totalHallazgos,
        analisis: observacionActualizada.analisis,
        createdAt: observacionActualizada.createdAt,
        updatedAt: observacionActualizada.updatedAt,
      };
    } else {
      // 4. Si no existe, crear una nueva (primera vez)
      return this.analyzeAndSave(actaId);
    }
  }
}
