// src/auth/dto/create-auth.dto.ts

import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class CreateAuthDto {
  @IsEmail({}, { message: 'El email debe ser un correo válido.' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  password: string;

  @IsString()
  nombre: string;

  @IsString()
  @IsOptional() // El apellido es opcional
  apellido?: string;

  @IsString()
  @IsOptional() // El teléfono es opcional
  telefono?: string;
}
