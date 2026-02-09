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

  // --- 👇 NUEVOS MÉTODOS PARA ADMINISTRADORES ---

  /**
   * Obtiene todos los usuarios que han usado el chatbot con estadísticas
   * @returns Lista de usuarios con datos de perfil, último mensaje y estadísticas
   */
  async getUsersWithChatActivity() {
    // Primera query: usuarios con datos de perfil
    const users = await this.prisma.user.findMany({
      where: {
        chatHistory: {
          some: {}, // Solo usuarios con al menos 1 mensaje
        },
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        telefono: true,
        createdAt: true,
        profile: {
          select: {
            cargo: true,
            institucion: true,
          },
        },
        _count: {
          select: {
            chatHistory: true, // Total de mensajes
          },
        },
      },
    });

    // Para cada usuario, obtener último mensaje y sesiones
    const usersWithDetails = await Promise.all(
      users.map(async (user) => {
        // Obtener último mensaje
        const ultimoMensaje = await this.prisma.chatHistory.findFirst({
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' },
          select: {
            userMessage: true,
            botResponse: true,
            createdAt: true,
          },
        });

        // Contar sesiones únicas
        const sesiones = await this.prisma.chatHistory.findMany({
          where: { userId: user.id },
          distinct: ['sessionId'],
          select: { sessionId: true },
        });

        return {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          apellido: user.apellido,
          nombreCompleto: `${user.nombre} ${user.apellido || ''}`.trim(),
          telefono: user.telefono,
          cargo: user.profile?.cargo,
          institucion: user.profile?.institucion,
          totalMensajes: user._count.chatHistory,
          totalSesiones: sesiones.length,
          ultimoMensaje: {
            texto:
              ultimoMensaje?.userMessage || ultimoMensaje?.botResponse || '',
            esDelUsuario: !!ultimoMensaje?.userMessage,
            timestamp: ultimoMensaje?.createdAt,
          },
          ultimaActividad: ultimoMensaje?.createdAt,
          createdAt: user.createdAt,
        };
      }),
    );

    // Ordenar por última actividad (más reciente primero)
    return usersWithDetails.sort((a, b) => {
      const dateA = a.ultimaActividad
        ? new Date(a.ultimaActividad).getTime()
        : 0;
      const dateB = b.ultimaActividad
        ? new Date(b.ultimaActividad).getTime()
        : 0;
      return dateB - dateA;
    });
  }

  /**
   * Obtiene todas las conversaciones de un usuario específico
   * @param userId ID del usuario
   * @returns Conversaciones completas agrupadas por fecha
   */
  async getAllUserConversations(userId: string) {
    // Obtener info completa del usuario
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        telefono: true,
        profile: {
          select: {
            cargo: true,
            institucion: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Obtener todos los mensajes
    const chatHistory = await this.prisma.chatHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        sessionId: true,
        userMessage: true,
        botResponse: true,
        createdAt: true,
      },
    });

    // Convertir a formato plano para renderizado de chat
    const mensajesPlanos: any[] = [];

    chatHistory.forEach((registro) => {
      // Primero agregar mensaje del usuario
      mensajesPlanos.push({
        id: `${registro.id}-user`,
        tipo: 'usuario',
        contenido: registro.userMessage,
        timestamp: registro.createdAt,
        sessionId: registro.sessionId,
      });

      // Luego agregar respuesta del bot
      mensajesPlanos.push({
        id: `${registro.id}-bot`,
        tipo: 'bot',
        contenido: registro.botResponse,
        timestamp: new Date(new Date(registro.createdAt).getTime() + 1000), // +1 segundo
        sessionId: registro.sessionId,
      });
    });

    // Agrupar por fecha para separadores
    const agrupadoPorFecha: Record<string, any[]> = {};

    mensajesPlanos.forEach((msg) => {
      const fecha = new Date(msg.timestamp).toISOString().split('T')[0];
      if (!agrupadoPorFecha[fecha]) {
        agrupadoPorFecha[fecha] = [];
      }

      agrupadoPorFecha[fecha].push({
        ...msg,
        hora: new Date(msg.timestamp).toLocaleTimeString('es-VE', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
      });
    });

    // Contar sesiones únicas
    const sesionesUnicas = [...new Set(chatHistory.map((ch) => ch.sessionId))];

    return {
      userId: user.id,
      userInfo: {
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        nombreCompleto: `${user.nombre} ${user.apellido || ''}`.trim(),
        telefono: user.telefono,
        cargo: user.profile?.cargo,
        institucion: user.profile?.institucion,
      },
      totalMensajes: mensajesPlanos.length,
      totalSesiones: sesionesUnicas.length,
      conversacion: mensajesPlanos,
      agrupadoPorFecha,
    };
  }

  /**
   * Obtiene una conversación específica por sessionId
   * @param sessionId ID de la sesión
   * @param userId ID del usuario (para validación)
   * @returns Mensajes de la sesión específica
   */
  async getConversationBySession(sessionId: string, userId: string) {
    const messages = await this.prisma.chatHistory.findMany({
      where: {
        sessionId,
        userId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
        userMessage: true,
        botResponse: true,
        createdAt: true,
      },
    });

    if (messages.length === 0) {
      return {
        sessionId,
        mensajes: [],
        error: 'No se encontraron mensajes para esta sesión',
      };
    }

    return {
      sessionId,
      userId,
      totalMensajes: messages.length,
      mensajes: messages,
    };
  }
}
