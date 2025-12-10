// src/auth/dto/update-acta.dto.ts

import { PartialType } from '@nestjs/swagger';
import { CreateActaDto } from './create-acta.dto';

import { IsDateString, IsOptional } from 'class-validator';

export class UpdateActaDto extends PartialType(CreateActaDto) {
  @IsOptional()
  @IsDateString()
  createdAt?: string; // Permitir editar fecha de creación
}
