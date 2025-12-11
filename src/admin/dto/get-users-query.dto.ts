// src/admin/dto/get-users-query.dto.ts
import { IsOptional, IsEnum, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetUsersQueryDto {
  @ApiPropertyOptional({
    description: 'Número de página (empieza en 1)',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Cantidad de elementos por página',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    enum: UserRole,
    description: 'Filtrar por rol de usuario',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Buscar por correo electrónico (coincidencia parcial)',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
