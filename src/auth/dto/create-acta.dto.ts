// src/actas/dto/create-acta.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsObject,
  IsOptional,
} from 'class-validator';
import { ActaType } from '@prisma/client';

export class CreateActaDto {
  @ApiProperty({
    enum: ActaType,
    description: 'El tipo de acta que se está creando.',
    example: ActaType.ENTRANTE_GRATIS,
  })
  @IsEnum(ActaType, { message: 'El tipo de acta no es válido.' })
  @IsNotEmpty({ message: 'El tipo de acta es requerido.' })
  type: ActaType;

  @ApiProperty({
    description: 'Nombre de la entidad u organismo donde se suscribe el acta.',
    example: 'Alcaldía de Ejemplo',
  })
  @IsString()
  @IsNotEmpty()
  nombreEntidad: string;

  @ApiProperty({ description: 'Ciudad de suscripción.', example: 'Caracas' })
  @IsString()
  @IsNotEmpty()
  ciudad: string;

  @ApiProperty({
    description: 'Estado de suscripción.',
    example: 'Distrito Capital',
  })
  @IsString()
  @IsNotEmpty()
  estado: string;

  @ApiProperty({
    // 👇 LA CORRECCIÓN ESTÁ AQUÍ
    type: Object,
    required: false,
    description:
      'Objeto JSON que contiene todos los campos específicos del tipo de acta.',
    example: {
      rifEntidad: 'J-12345678-9',
      cargoEntregado: 'Director General',
    },
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
