// src/users/dto/delete-account.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class DeleteAccountDto {
  @ApiProperty({
    description:
      'Contraseña del usuario para confirmar la eliminación de la cuenta',
    example: 'miPasswordSegura123',
  })
  @IsString()
  @MinLength(8, { message: 'La contraseña es requerida.' })
  password: string;
}
