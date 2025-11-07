// src/auth/dto/verify-otp.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({ example: 'usuario@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: 'Código de 6 dígitos' })
  @IsString()
  @Length(6, 6)
  otp: string;
}
