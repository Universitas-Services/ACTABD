import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsUUID, ArrayNotEmpty } from 'class-validator';

export class BulkDeleteUsersDto {
  @ApiProperty({
    description: 'Lista de IDs de usuarios a eliminar (desactivar)',
    example: ['uuid-1', 'uuid-2'],
    isArray: true,
  })
  @IsArray()
  @ArrayNotEmpty({ message: 'La lista de IDs no puede estar vacía.' })
  @IsString({ each: true, message: 'Cada ID debe ser una cadena de texto.' })
  @IsUUID('4', { each: true, message: 'Cada ID debe ser un UUID válido.' })
  userIds: string[];
}
