// src/ai/ai.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { GetChatUsersQueryDto } from './dto/get-chat-users-query.dto';

type AdkChatResponse = {
  response?: string;
  session_id?: string;
};

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly gatewayUrl: string;
  private readonly gatewayTimeoutMs: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const gatewayUrl = this.configService.get<string>('ADK_GATEWAY_URL');

    if (!gatewayUrl) {
      throw new Error(
        'Falta la variable de entorno ADK_GATEWAY_URL (gateway ADK en Cloud Run).',
      );
    }

    this.gatewayUrl = gatewayUrl.replace(/\/$/, '');
    this.gatewayTimeoutMs =
      Number(this.configService.get<string>('ADK_GATEWAY_TIMEOUT_MS')) ||
      120_000;
  }

  /**
   * Envía un mensaje al gateway ADK (Vertex Reasoning Engine) y devuelve
   * la respuesta en texto del agente.
   */
  async detectIntentText(text: string, sessionId: string): Promise<string> {
    const url = `${this.gatewayUrl}/api/chat`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          session_id: sessionId,
        }),
        signal: AbortSignal.timeout(this.gatewayTimeoutMs),
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        this.logger.error(
          `Gateway ADK respondió ${response.status}: ${errorBody}`,
        );
        return 'Lo siento, estoy teniendo problemas para conectarme. Por favor, inténtalo más tarde.';
      }

      const data = (await response.json()) as AdkChatResponse;
      const botResponse = data.response?.trim();

      return (
        botResponse ||
        'No he podido entender eso. ¿Puedes decirlo de otra forma?'
      );
    } catch (error) {
      this.logger.error('Error al contactar el gateway ADK', error);
      return 'Lo siento, estoy teniendo problemas para conectarme. Por favor, inténtalo más tarde.';
    }
  }

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

  generateSessionId(): string {
    return uuidv4();
  }

  /**
   * Obtiene todos los usuarios que han usado el chatbot con estadísticas
   * Soporta búsqueda por nombre/apellido y paginación
   */
  async getUsersWithChatActivity(query: GetChatUsersQueryDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    // Construir filtro dinámico
    const where: Prisma.UserWhereInput = {
      chatHistory: {
        some: {}, // Solo usuarios con al menos 1 mensaje
      },
    };

    // Filtro de búsqueda por nombre o apellido
    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { apellido: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Conteo total para paginación
    const totalItems = await this.prisma.user.count({ where });

    // Primera query: usuarios con datos de perfil (paginados)
    const users = await this.prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
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
    const sortedUsers = usersWithDetails.sort((a, b) => {
      const dateA = a.ultimaActividad
        ? new Date(a.ultimaActividad).getTime()
        : 0;
      const dateB = b.ultimaActividad
        ? new Date(b.ultimaActividad).getTime()
        : 0;
      return dateB - dateA;
    });

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: sortedUsers,
      meta: {
        totalItems,
        itemCount: sortedUsers.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
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
