// src/users/dto/complete-profile.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CompleteProfileDto {
  @ApiProperty({
    description: 'Institución a la que pertenece el usuario',
    example: 'Ministerio de Educación',
  })
  @IsString()
  @IsNotEmpty()
  institucion: string;

  @ApiProperty({
    description: 'Cargo actual del usuario en la institución',
    example: 'Director General',
  })
  @IsString()
  @IsNotEmpty()
  cargo: string;

  @ApiProperty({
    required: false, // Basado en tu schema, este campo es opcional
    description: 'Plazo en días para la entrega del acta (opcional)',
    example: '30 días',
  })
  @IsString()
  @IsOptional()
  plazoEntregaActa?: string;
}
