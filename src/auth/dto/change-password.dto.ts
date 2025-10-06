// src/users/dto/change-password.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'La contraseña actual del usuario para verificación',
    example: 'passwordActual123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, {
    message: 'La contraseña actual debe tener al menos 8 caracteres.',
  })
  currentPassword: string;

  @ApiProperty({
    description: 'La nueva contraseña para el usuario',
    example: 'nuevaPassword456',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, {
    message: 'La nueva contraseña debe tener al menos 8 caracteres.',
  })
  newPassword: string;
}
