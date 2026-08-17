// src/ai/dto/send-message.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SendMessageDto {
  @ApiProperty({
    description: 'Mensaje que el usuario envía al chatbot.',
    example: 'Hola, necesito ayuda.',
    minLength: 1,
    maxLength: 4096,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(4096)
  message!: string;

  @ApiProperty({
    required: false,
    description:
      'ID estable de la conversación (1–128 chars). Si no se envía, el backend genera uno y debes reutilizarlo.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    minLength: 1,
    maxLength: 128,
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(128)
  sessionId?: string;
}
