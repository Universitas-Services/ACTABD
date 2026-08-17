// src/admin/dto/get-users-query.dto.ts
import {
  IsOptional,
  IsEnum,
  IsString,
  IsInt,
  Min,
  IsIn,
  IsBoolean,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
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

  @ApiPropertyOptional({
    enum: ['GRATIS', 'PAGO'],
    description: 'Filtrar por tipo de plan (GRATIS = USER, PAGO = PAID_USER)',
  })
  @IsOptional()
  @IsIn(['GRATIS', 'PAGO'])
  tipoPlan?: 'GRATIS' | 'PAGO';

  @ApiPropertyOptional({
    description:
      'Filtrar por estado: true = activos, false = suspendidos. Si se omite, muestra todos.',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @IsBoolean()
  isActive?: boolean;
}
