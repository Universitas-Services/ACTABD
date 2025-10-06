// src/users/dto/update-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    required: false,
    example: 'Juan Actualizado',
    description: 'Nuevo nombre del usuario',
  })
  @IsString()
  @IsOptional()
  nombre?: string;

  @ApiProperty({
    required: false,
    example: 'Pérez Silva',
    description: 'Nuevo apellido del usuario',
  })
  @IsString()
  @IsOptional()
  apellido?: string;

  @ApiProperty({
    required: false,
    example: '0412-999-9999',
    description: 'Nuevo teléfono de contacto del usuario',
  })
  @IsString()
  @IsOptional()
  telefono?: string;
}
