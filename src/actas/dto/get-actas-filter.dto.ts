// src/actas/dto/get-actas-filter.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ActaStatus, ActaType } from '@prisma/client';

export class GetActasFilterDto {
  @ApiPropertyOptional({
    description: 'Término de búsqueda (nombre entidad o número acta)',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: ActaStatus,
    description: 'Filtrar por estatus del acta',
  })
  @IsOptional()
  @IsEnum(ActaStatus)
  status?: ActaStatus;

  @ApiPropertyOptional({
    enum: ActaType,
    description: 'Filtrar por tipo de acta',
  })
  @IsOptional()
  @IsEnum(ActaType)
  type?: ActaType;

  @ApiPropertyOptional({ description: 'Número de página', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Elementos por página', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'ID del usuario para filtrar (Solo Admin)',
  })
  @IsOptional()
  @IsString()
  userId?: string;
}
