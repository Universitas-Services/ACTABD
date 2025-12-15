import {
  IsString,
  IsNotEmpty,
  IsObject,
  IsEnum,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { ActaType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActaDto {
  @ApiProperty({
    description: 'Nombre de la entidad u órgano que gestiona el acta',
    example: 'Ministerio de Finanzas',
  })
  @IsString()
  @IsNotEmpty({ message: 'El campo nombreEntidad no debe estar vacío' })
  nombreEntidad: string;

  @ApiProperty({
    description: 'Tipo de acta a crear',
    enum: ActaType,
    example: ActaType.ENTRANTE_GRATIS,
  })
  @IsEnum(ActaType, { message: 'El tipo de acta no es válido' })
  @IsNotEmpty({ message: 'El campo type no debe estar vacío' })
  type: ActaType;

  @ApiProperty({
    description: 'Objeto JSON con los datos del formulario del acta',
    example: {
      fechaSuscripcion: '2024-05-20',
      rif: 'G-20000000-1',
      q1_lugar: 'Caracas',
      q2_fecha: '2024-05-20',
    },
  })
  @IsObject()
  @IsNotEmpty({ message: 'El campo metadata no debe estar vacío' })
  metadata: Record<string, any>;

  @ApiProperty({
    description: 'Tiempo estimado de realización (índice 0-3)',
    example: 1,
    minimum: 0,
    maximum: 3,
  })
  @IsInt()
  @Min(0)
  @Max(3)
  @IsNotEmpty()
  tiempoRealizacion: number;
}
