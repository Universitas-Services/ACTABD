// src/admin/dto/update-role.dto.ts
import { ApiProperty } from '@nestjs/swagger';
// --- ¡ESTA ES LA LÍNEA QUE FALTA! ---
import { IsEnum, IsString, IsNotEmpty } from 'class-validator';
import { UserRole } from '@prisma/client';

export class UpdateUserRoleDto {
  @ApiProperty({ description: 'El ID del usuario a modificar' })
  @IsString() // <-- Esto ya no dará error
  @IsNotEmpty() // <-- Esto ya no dará error
  userId: string;

  @ApiProperty({ enum: UserRole, example: UserRole.PAID_USER })
  @IsEnum(UserRole) // <-- Esto ya no dará error
  @IsNotEmpty()
  newRole: UserRole;
}
