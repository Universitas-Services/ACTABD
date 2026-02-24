import { ApiProperty } from '@nestjs/swagger';

export class ActaComplianceAdminInfoResponseDto {
  @ApiProperty({ example: 'usuario@example.com' })
  email: string;

  @ApiProperty({ example: 'Juan Pérez' })
  nombreevaluador: string;

  @ApiProperty({ example: 'Director de Auditoría' })
  denominacionCargo: string;

  @ApiProperty({ example: 'Unidad de Control Interno' })
  nombreUnidad: string;
}
