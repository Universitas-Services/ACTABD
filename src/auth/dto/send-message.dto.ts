// src/ai/dto/send-message.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({
    description: 'Mensaje que el usuario envía al chatbot.',
    example: 'Hola, necesito ayuda.',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    required: false,
    description:
      'ID de la sesión de chat para mantener el contexto de la conversación.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsString()
  @IsUUID()
  @IsOptional()
  sessionId?: string;
}
