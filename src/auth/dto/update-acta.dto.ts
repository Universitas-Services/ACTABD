// src/auth/dto/update-acta.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsObject, IsOptional } from 'class-validator';
import { ActaType } from '@prisma/client';

export class UpdateActaDto {
  @ApiProperty({
    enum: ActaType,
    required: false,
    description: 'El tipo de acta.',
    example: ActaType.ENTRANTE_PAGA,
  })
  @IsEnum(ActaType)
  @IsOptional()
  type?: ActaType;

  @ApiProperty({
    required: false,
    description: 'Nombre de la entidad u organismo.',
    example: 'Contraloría General',
  })
  @IsString()
  @IsOptional()
  nombreEntidad?: string;

  @ApiProperty({
    required: false,
    description: 'Ciudad de suscripción.',
    example: 'Barquisimeto',
  })
  @IsString()
  @IsOptional()
  ciudad?: string;

  @ApiProperty({
    required: false,
    description: 'Estado de suscripción.',
    example: 'Lara',
  })
  @IsString()
  @IsOptional()
  estado?: string;

  @ApiProperty({
    type: Object,
    required: false,
    description: 'Objeto JSON con campos específicos del acta.',
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
