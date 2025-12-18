import { ApiProperty } from '@nestjs/swagger';

export class ActaAdminInfoResponseDto {
  @ApiProperty({ example: 'usuario@example.com' })
  email: string;

  // Campos para Acta Saliente
  @ApiProperty({ required: false })
  nombreServidorSaliente?: string;

  @ApiProperty({ required: false })
  designacionServidorSaliente?: string;

  @ApiProperty({ required: false })
  nombreServidorRecibe?: string;

  @ApiProperty({ required: false })
  designacionServidorRecibe?: string;

  // Campos para Acta Entrante y Máxima Autoridad
  @ApiProperty({ required: false })
  nombreServidorEntrante?: string;

  @ApiProperty({ required: false })
  designacionServidorEntrante?: string;

  @ApiProperty({ required: false })
  nombreAuditor?: string;

  @ApiProperty({ required: false })
  profesionAuditor?: string;

  @ApiProperty({ required: false })
  nombreTestigo1?: string;

  @ApiProperty({ required: false })
  profesionTestigo1?: string;

  @ApiProperty({ required: false })
  nombreTestigo2?: string;

  @ApiProperty({ required: false })
  profesionTestigo2?: string;
}
