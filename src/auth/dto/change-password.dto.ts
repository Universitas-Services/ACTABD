// src/users/dto/change-password.dto.ts

import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(8, {
    message: 'La contraseña actual debe tener al menos 8 caracteres.',
  })
  currentPassword: string;

  @IsString()
  @MinLength(8, {
    message: 'La nueva contraseña debe tener al menos 8 caracteres.',
  })
  newPassword: string;
}
