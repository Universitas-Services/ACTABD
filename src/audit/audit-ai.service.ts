/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-require-imports */

// src/audit/audit-ai.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface FindingDefinition {
  pregunta: string;
  condicion: string;
}

// Función de espera (4s) para no saturar la API de Google
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

@Injectable()
export class AuditAiService {
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
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async getContext(): Promise<string> {
    if (this.contextCache) return this.contextCache;

    this.logger.log('Cargando contexto legal desde GCS...');
    const bucketName = this.configService.get<string>('BUCKET_NAME');

    if (!bucketName) {
      this.logger.error('BUCKET_NAME no definido');
      return '';
    }

    try {
      // 👇 Carga dinámica para evitar conflictos de compilación
      const pdfLib = require('pdf-parse');

      // 👇 ADAPTADOR ROBUSTO: Detectamos si es función u objeto
      let pdfParse: any;
      if (typeof pdfLib === 'function') {
        pdfParse = pdfLib;
      } else if (pdfLib.default && typeof pdfLib.default === 'function') {
        pdfParse = pdfLib.default;
      } else {
        // Intento final de recuperación
        pdfParse = require('pdf-parse/lib/pdf-parse.js');
      }

      const [files] = await this.storage.bucket(bucketName).getFiles();
      let fullText = '';

      for (const file of files) {
        if (file.name.toLowerCase().endsWith('.pdf')) {
          this.logger.log(`Procesando archivo: ${file.name}`);
          const [buffer] = await file.download();

          // 👇 Usamos la función detectada
          const data = await pdfParse(buffer);

          if (data && data.text) {
            fullText += data.text + '\n\n---\n\n';
          }
        }
      }

      this.contextCache = fullText;
      this.logger.log(
        `Contexto cargado. Longitud: ${fullText.length} caracteres.`,
      );
      return fullText;
    } catch (error) {
      this.logger.error('Error leyendo GCS o procesando PDF', error);
      return '';
    }
  }

  private async askGemini(question: string, context: string): Promise<string> {
    if (!context || context.length < 50) {
      return '⚠️ No se pudo analizar porque el contexto legal no se cargó correctamente.';
    }

    const prompt = `
      Actúa como auditor experto.
      SITUACIÓN: En un acta de entrega se indicó "NO" al documento: "${question}".
      TAREA: Basado en el siguiente CONTEXTO LEGAL, explica brevemente el riesgo o implicación de esta falta.
      CONTEXTO: ${context.substring(0, 30000)}...
      
      Respuesta corta y profesional:
    `;
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (e) {
      this.logger.error('Error consultando Gemini', e);
      return 'Error al conectar con el servicio de IA.';
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
        this.logger.log(`Analizando hallazgo ${count}: ${key}`);

        // Pausa de 4 segundos para evitar Error 429
        if (count > 1) await delay(4000);

        const analisis = await this.askGemini(definition.pregunta, context);

        reporte += `\n🔴 [${count}] Hallazgo: ${definition.pregunta}\n`;
        reporte += `   Condición: ${definition.condicion}\n`;
        reporte += `   🤖 Riesgo (IA): ${analisis}\n`;
      }
    }

    if (count === 0)
      return "✅ No se detectaron incumplimientos marcados como 'NO'.";

    return reporte;
  }
}
