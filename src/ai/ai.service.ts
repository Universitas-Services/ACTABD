// src/ai/ai.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SessionsClient } from '@google-cloud/dialogflow-cx';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AiService {
  private readonly sessionsClient: SessionsClient;
  private readonly projectId: string;
  private readonly location: string;
  private readonly agentId: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const keyFilename = this.configService.get<string>(
      'GOOGLE_APPLICATION_CREDENTIALS',
    );
    const projectId = this.configService.get<string>('DIALOGFLOW_PROJECT_ID');
    const location = this.configService.get<string>('DIALOGFLOW_LOCATION');
    const agentId = this.configService.get<string>('DIALOGFLOW_AGENT_ID');

    if (!keyFilename || !projectId || !location || !agentId) {
      throw new Error(
        'Faltan variables de entorno necesarias para Dialogflow CX.',
      );
    }

    this.projectId = projectId;
    this.location = location;
    this.agentId = agentId;
    this.sessionsClient = new SessionsClient({ keyFilename });
  }

  async detectIntentText(text: string, sessionId: string): Promise<string> {
    const sessionPath = this.sessionsClient.projectLocationAgentSessionPath(
      this.projectId,
      this.location,
      this.agentId,
      sessionId,
    );
    const request = {
      session: sessionPath,
      queryInput: { text: { text }, languageCode: 'es' },
    };
    try {
      const [response] = await this.sessionsClient.detectIntent(request);
      let botResponse = '';
      for (const message of response.queryResult?.responseMessages || []) {
        const textParts = message.text?.text || [];
        botResponse += textParts.join(' ');
      }
      return (
        botResponse ||
        'No he podido entender eso. ¿Puedes decirlo de otra forma?'
      );
    } catch (error) {
      console.error('Error al contactar con Dialogflow CX:', error);
      return 'Lo siento, estoy teniendo problemas para conectarme. Por favor, inténtalo más tarde.';
    }
  }

  // --- 👇 ESTE MÉTODO SOLUCIONA UNO DE LOS ERRORES ---
  async saveChatHistory(
    user: User,
    sessionId: string,
    userMessage: string,
    botResponse: string,
  ) {
    return this.prisma.chatHistory.create({
      data: {
        sessionId,
        userMessage,
        botResponse,
        user: { connect: { id: user.id } },
      },
    });
  }

  // --- 👇 ESTE MÉTODO SOLUCIONA EL OTRO ERROR ---
  generateSessionId(): string {
    return uuidv4();
  }
}
