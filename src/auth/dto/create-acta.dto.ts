// src/actas/dto/create-acta.dto.ts

import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsObject,
  IsOptional,
} from 'class-validator';
import { ActaType } from '@prisma/client'; // Importamos el enum de Prisma

export class CreateActaDto {
  @IsEnum(ActaType, { message: 'El tipo de acta no es válido.' })
  @IsNotEmpty({ message: 'El tipo de acta es requerido.' })
  type: ActaType;

  // --- Campos Comunes ---
  @IsString()
  @IsNotEmpty()
  nombreEntidad: string;

  @IsString()
  @IsNotEmpty()
  ciudad: string;

  @IsString()
  @IsNotEmpty()
  estado: string;

  // Nota: La fecha se generará en el servicio, no es necesario que el cliente la envíe.

  // --- Campos Específicos (Metadata) ---
  // 'metadata' será un objeto que contendrá todos los demás campos.
  // El frontend deberá enviar los campos específicos dentro de este objeto.
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
