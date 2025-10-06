// src/users/dto/delete-account.dto.ts

import { IsString, MinLength } from 'class-validator';

export class DeleteAccountDto {
  @IsString()
  @MinLength(8, { message: 'La contraseña es requerida.' })
  password: string;
}
