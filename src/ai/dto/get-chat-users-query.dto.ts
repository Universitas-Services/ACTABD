// src/ai/dto/get-chat-users-query.dto.ts
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetChatUsersQueryDto {
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
    description:
      'Buscar por nombre o apellido del usuario (coincidencia parcial)',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
