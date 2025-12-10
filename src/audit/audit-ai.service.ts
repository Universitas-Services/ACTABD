/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-require-imports */

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { GoogleGenerativeAI } from '@google/generative-ai';

const pdfLib = require('pdf-extraction');

export interface FindingDefinition {
  pregunta: string;
  condicion: string;
}

// 👇 AUMENTADO A 15 SEGUNDOS PARA EVITAR ERROR 429 POR TOKENS
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

@Injectable()
export class AuditAiService implements OnModuleInit {
  private readonly logger = new Logger(AuditAiService.name);
  private storage: Storage;
  private genAI: GoogleGenerativeAI;
  private model: any;
  private contextCache: string | null = null;

  constructor(private configService: ConfigService) {
    this.storage = new Storage({
      projectId: this.configService.get('GOOGLE_CLOUD_PROJECT_ID'),
    });

    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.genAI = new GoogleGenerativeAI(apiKey || '');

    // Usamos el modelo gemini-2.5-flash (estable y actual)
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  onModuleInit() {
    this.logger.log('✅ AuditAiService listo con modelo: gemini-2.5-flash');
  }

  async getContext(): Promise<string> {
    if (this.contextCache) return this.contextCache;

    this.logger.log('Iniciando carga de contexto legal desde GCS...');
    const bucketName = this.configService.get<string>('BUCKET_NAME');

    if (!bucketName) {
      this.logger.error('BUCKET_NAME no definido en .env');
      return '';
    }

    try {
      let pdfParse: any;
      if (typeof pdfLib === 'function') {
        pdfParse = pdfLib;
      } else if (pdfLib.default && typeof pdfLib.default === 'function') {
        pdfParse = pdfLib.default;
      } else {
        pdfParse = require('pdf-extraction');
      }

      const [files] = await this.storage.bucket(bucketName).getFiles();
      let fullText = '';
      let filesProcessed = 0;

      this.logger.log(`Se encontraron ${files.length} archivos en el bucket.`);

      for (const file of files) {
        if (file.name.toLowerCase().endsWith('.pdf')) {
          this.logger.log(`Procesando PDF: ${file.name}`);
          const [buffer] = await file.download();

          try {
            const data = await pdfParse(buffer);

            if (data && data.text) {
              fullText +=
                `\n--- DOCUMENTO: ${file.name} ---\n` + data.text + '\n';
              filesProcessed++;
            }
          } catch (parseError) {
            this.logger.error(
              `Error al extraer texto de ${file.name}:`,
              parseError,
            );
          }
        }
      }

      if (filesProcessed === 0) {
        this.logger.warn('⚠️ No se pudo extraer texto de ningún PDF.');
      } else {
        this.logger.log(
          `✅ Contexto cargado. ${filesProcessed} leyes procesadas. Total: ${fullText.length} caracteres.`,
        );
      }

      this.contextCache = fullText;
      return fullText;
    } catch (error) {
      this.logger.error('Error leyendo GCS o procesando PDF', error);
      return '';
    }
  }

  private async askGemini(question: string, context: string): Promise<string> {
    if (!context || context.length < 50) {
      return '⚠️ No se pudo analizar. El contexto legal no se cargó correctamente.';
    }

    const prompt = `
      Actúa como un Asistente de IA experto en la normativa de administración pública de Venezuela y especialista en el proceso de elaboración de actas de entrega, conforme a la Ley Orgánica de la Contraloría General de la República y las "Normas para Regular la Entrega de los Órganos y Entidades de la Administración Pública".

      Tu función es analizar una respuesta negativa ("NO") de un anexo de un acta de entrega. La pregunta que no fue respondida afirmativamente es: "${question}"

      Basándote en el CONTEXTO legal que posees, genera una observación técnica que incluya:
      1. Identificación del Anexo Faltante.
      2. Importancia del Documento.
      3. Fundamento Legal (Cita artículos de la Resolución 01-00-000162 si aplica).
      4. Implicaciones Legales (Funcionario Saliente, Entrante, Máxima Autoridad).
      5. Acción Correctiva Sugerida.

      ---CONTEXTO---
      ${context.substring(0, 30000)}...
      ---FIN DEL CONTEXTO---
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (e) {
      this.logger.error('Error consultando Gemini', e);
      return 'Error al conectar con IA (Posiblemente cuota excedida).';
    }
  }

  async analyze(
    data: Record<string, any>,
    findingsMap: Record<string, FindingDefinition>,
  ): Promise<string> {
    const context = await this.getContext();

    let reporte = 'REPORTE DE ANÁLISIS IA\n-----------------------\n';
    let count = 0;

    for (const [key, definition] of Object.entries(findingsMap)) {
      const valor = data[key];

      if (
        valor &&
        typeof valor === 'string' &&
        valor.trim().toUpperCase() === 'NO'
      ) {
        count++;
        this.logger.log(`[${count}] Analizando hallazgo: ${key}`);

        // 👇 DELAY AUMENTADO A 15 SEGUNDOS
        if (count > 1) {
          this.logger.log('Esperando 15s para liberar cuota de tokens...');
          await delay(15000);
        }

        const analisis = await this.askGemini(definition.pregunta, context);

        reporte += `\n🔴 Hallazgo #${count}: ${definition.pregunta}\n`;
        reporte += `   Condición: ${definition.condicion}\n`;
        reporte += `   🤖 Análisis IA: ${analisis}\n`;
      }
    }

    if (count === 0) return '✅ El análisis no detectó incumplimientos.';

    return reporte;
  }
}
