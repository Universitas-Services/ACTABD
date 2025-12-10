// src/auth/dto/create-acta.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsObject,
  IsEnum,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { ActaType } from '@prisma/client';

export class CreateActaDto {
  @IsString()
  @IsNotEmpty({ message: 'El campo nombreEntidad no debe estar vacío' })
  nombreEntidad: string; // <-- REQUERIDO (para tu admin panel)

  @IsEnum(ActaType, { message: 'El tipo de acta no es válido' })
  @IsNotEmpty({ message: 'El campo type no debe estar vacío' })
  type: ActaType; // <-- REQUERIDO (para filtrar)

  @IsObject()
  @IsNotEmpty({ message: 'El campo metadata no debe estar vacío' })
  metadata: Record<string, any>; // <-- REQUERIDO (aquí va todo lo demás)

  @IsInt()
  @Min(0)
  @Max(3)
  @IsNotEmpty()
  tiempoRealizacion: number;
}
