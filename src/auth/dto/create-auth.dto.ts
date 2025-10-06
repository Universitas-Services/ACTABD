// src/auth/dto/create-auth.dto.ts
import { ApiProperty } from '@nestjs/swagger'; // <-- 1. Importa ApiProperty
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({
    example: 'juan.perez@example.com',
    description: 'Correo electrónico del usuario',
  }) // <-- 2. Añade decorador
  @IsEmail({}, { message: 'El email debe ser un correo válido.' })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Contraseña con al menos 8 caracteres',
  })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  password: string;

  @ApiProperty({ example: 'Juan', description: 'Nombre del usuario' })
  @IsString()
  nombre: string;

  @ApiProperty({
    required: false,
    example: 'Pérez',
    description: 'Apellido del usuario (opcional)',
  })
  @IsString()
  @IsOptional()
  apellido?: string;

  @ApiProperty({
    required: false,
    example: '+123456789',
    description: 'Teléfono del usuario (opcional)',
  })
  @IsString()
  @IsOptional()
  telefono?: string;
}
