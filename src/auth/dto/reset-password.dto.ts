// src/auth/dto/reset-password.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'usuario@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'nuevaPasswordSegura123' })
  @IsString()
  @MinLength(8)
  newPassword: string;
}
