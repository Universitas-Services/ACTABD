import { ApiProperty } from '@nestjs/swagger';
import { Acta, ActaStatus, ActaType } from '@prisma/client';

export class ActaResponseDto implements Acta {
  @ApiProperty({
    description: 'Identificador único del acta (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Número de consecutivo del acta',
    example: 'ACTA-0001',
    required: false,
    nullable: true,
  })
  numeroActa: string | null;

  @ApiProperty({
    description: 'Nombre de la entidad u órgano',
    example: 'Ministerio de Ejemplo',
    required: false,
    nullable: true,
  })
  nombreEntidad: string | null;

  @ApiProperty({
    description:
      'Tipo de acta (Entrante/Saliente/Máxima Autoridad, Gratis/Paga)',
    enum: ActaType,
    example: ActaType.ENTRANTE_GRATIS,
  })
  type: ActaType;

  @ApiProperty({
    description: 'Estado actual del acta',
    enum: ActaStatus,
    example: ActaStatus.GUARDADA,
  })
  status: ActaStatus;

  @ApiProperty({
    description: 'Datos dinámicos del acta (formulario). Objeto JSON libre.',
    example: {
      fechaSuscripcion: '2024-01-01',
      rif: 'J-12345678-9',
      q1_pregunta: 'Respuesta ejemplo',
    },
  })
  metadata: any;

  @ApiProperty({
    description: 'ID del usuario propietario del acta',
    example: 'user-uuid-123',
  })
  userId: string;

  @ApiProperty({
    description: 'Fecha de creación del registro',
    example: '2024-01-01T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de la última actualización',
    example: '2024-01-02T15:30:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description:
      'Indica si el acta cumple con el mínimo de datos requeridos (54 campos)',
    example: false,
  })
  isCompleted: boolean;

  @ApiProperty({
    description: 'Tiempo estimado de realización (índice 0-3)',
    example: 1,
  })
  tiempoRealizacion: number;

  @ApiProperty({
    description: 'Registro de notificaciones enviadas',
    required: false,
    nullable: true,
    example: ['30_DAYS', '100_DAYS'],
  })
  notificationsSent: any;

  // --- CAMPOS DECORADOS / CALCULADOS ---

  @ApiProperty({
    description: 'Días hábiles restantes para el vencimiento (calculado)',
    required: false,
    example: 115,
  })
  diasRestantes?: number;

  @ApiProperty({
    description: 'Indica si el acta está próxima a vencer o vencida',
    required: false,
    example: false,
  })
  alertaVencimiento?: boolean;
}
