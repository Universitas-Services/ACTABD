// src/acta-compliance/dto/get-compliance-filter.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ActaStatus } from '@prisma/client'; // <--- 1. Importar el Enum generado

export class GetComplianceFilterDto {
  @ApiPropertyOptional({
    description:
      'Buscar por Nombre Entidad, Número Compliance o Código Documento',
  })
  @IsOptional()
  @IsString()
  search?: string;

  // 👇 CAMPO NUEVO CON EL TIPO CORRECTO
  @ApiPropertyOptional({
    enum: ActaStatus, // Para que Swagger muestre las opciones
    description: 'Filtrar por estatus (GUARDADA, DESCARGADA, ENVIADA)',
  })
  @IsOptional()
  @IsEnum(ActaStatus) // Valida que lo que envíen sea uno de los valores permitidos
  status?: ActaStatus; // Tipado estricto con el Enum
  // 👆 ----------------

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
