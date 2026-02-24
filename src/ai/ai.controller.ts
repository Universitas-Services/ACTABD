// src/ai/ai.controller.ts

import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { SendMessageDto } from '../auth/dto/send-message.dto';
import type { User } from '@prisma/client';
import { UserRole } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
@ApiTags('Chatbot AI') // <-- Agrupa bajo "Chatbot AI"
@ApiBearerAuth()
@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('message')
  @ApiOperation({ summary: 'Enviar un mensaje al agente de IA' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Devuelve la respuesta del agente y el ID de la sesión.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  async handleMessage(
    @Body() sendMessageDto: SendMessageDto,
    @GetUser() user: User,
  ) {
    const { message, sessionId: providedSessionId } = sendMessageDto;

    // Si no se proporciona un sessionId, se genera uno nuevo para la conversación.
    const sessionId = providedSessionId || this.aiService.generateSessionId();

    // 1. Obtiene la respuesta del bot
    const botResponse = await this.aiService.detectIntentText(
      message,
      sessionId,
    );

    // 2. Guarda la conversación en la base de datos
    await this.aiService.saveChatHistory(user, sessionId, message, botResponse);

    // 3. Devuelve la respuesta al frontend
    return {
      sessionId,
      response: botResponse,
    };
  }

  // --- 👇 ENDPOINTS PARA ADMINISTRADORES ---

  @Get('admin/users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Listar todos los usuarios que han usado el chatbot (Solo Admin)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de usuarios con estadísticas de uso del chatbot.',
    schema: {
      example: [
        {
          id: 'uuid-user-1',
          email: 'usuario@example.com',
          nombre: 'Juan',
          apellido: 'Pérez',
          nombreCompleto: 'Juan Pérez',
          telefono: '+58 412-1234567',
          cargo: 'Supervisor de Ente',
          institucion: 'Ministerio de Educación',
          totalMensajes: 45,
          totalSesiones: 3,
          ultimoMensaje: {
            texto: 'Gracias por la información',
            esDelUsuario: true,
            timestamp: '2026-02-09T13:00:00Z',
          },
          ultimaActividad: '2026-02-09T13:00:00Z',
          createdAt: '2026-01-15T10:00:00Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'No autorizado. Solo administradores.',
  })
  async getAllUsersWithChat() {
    return this.aiService.getUsersWithChatActivity();
  }

  @Get('admin/users/:userId/conversations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary:
      'Ver todas las conversaciones de un usuario específico (Solo Admin)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Historial completo de conversaciones del usuario.',
    schema: {
      example: {
        userId: 'uuid-user-1',
        userInfo: {
          email: 'usuario@example.com',
          nombre: 'Juan',
          apellido: 'Pérez',
          nombreCompleto: 'Juan Pérez',
          telefono: '+58 412-1234567',
          cargo: 'Supervisor de Ente',
          institucion: 'Ministerio de Educación',
        },
        totalMensajes: 45,
        totalSesiones: 2,
        conversacion: [
          {
            id: 'msg-1-user',
            tipo: 'usuario',
            contenido: '¿Qué es un acta de entrega?',
            timestamp: '2026-02-09T09:22:00Z',
            sessionId: 'session-123',
          },
          {
            id: 'msg-1-bot',
            tipo: 'bot',
            contenido: 'Un acta de entrega es un documento oficial...',
            timestamp: '2026-02-09T09:23:00Z',
            sessionId: 'session-123',
          },
        ],
        agrupadoPorFecha: {
          '2026-02-09': [
            {
              id: 'msg-1-user',
              tipo: 'usuario',
              contenido: '¿Qué es un acta de entrega?',
              timestamp: '2026-02-09T09:22:00Z',
              hora: '9:22 AM',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'No autorizado. Solo administradores.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario no encontrado.',
  })
  @ApiQuery({
    name: 'sessionId',
    required: false,
    description:
      'ID de sesión opcional. Si se proporciona, solo devuelve mensajes de esa sesión específica. Si no se proporciona, devuelve todas las conversaciones del usuario.',
    type: String,
  })
  async getUserConversations(
    @Param('userId') userId: string,
    @Query('sessionId') sessionId?: string,
  ) {
    // Si se proporciona sessionId, devolver solo esa sesión
    if (sessionId) {
      return this.aiService.getConversationBySession(sessionId, userId);
    }
    // Si no, devolver todas las conversaciones del usuario
    return this.aiService.getAllUserConversations(userId);
  }
}
