// src/ai/dto/send-message.dto.ts

import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  sessionId?: string;
}
