// src/ai/ai.controller.ts

import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { SendMessageDto } from '../auth/dto/send-message.dto';
import type { User } from '@prisma/client';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('message')
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
}
