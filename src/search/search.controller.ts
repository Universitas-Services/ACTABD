import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { AnalyzeActaDto } from './dto/analyze-acta.dto';

@ApiTags('Search - Observaciones Legales')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post('analyze-acta')
  @ApiOperation({
    summary: 'Generar y guardar observaciones legales',
    description:
      'Analiza un acta con IA (Vertex AI + Gemini) y guarda las observaciones en la base de datos. Tarda ~12 segundos por hallazgo.',
  })
  @ApiResponse({
    status: 201,
    description: 'Observaciones generadas y guardadas exitosamente',
  })
  @ApiResponse({ status: 400, description: 'actaId no proporcionado' })
  @ApiResponse({ status: 500, description: 'Acta no encontrada o error de IA' })
  async analyzeActa(@Body() dto: AnalyzeActaDto) {
    if (!dto.actaId) {
      throw new BadRequestException('Debes enviar un "actaId"');
    }
    return await this.searchService.analyzeAndSave(dto.actaId);
  }

  @Get('observaciones/:actaId')
  @ApiOperation({
    summary: 'Consultar última observación',
    description:
      'Devuelve la última observación guardada para un acta (sin llamar a IA)',
  })
  @ApiParam({
    name: 'actaId',
    description: 'ID del acta',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Observación encontrada',
  })
  @ApiResponse({
    status: 500,
    description: 'No se encontraron observaciones para esta acta',
  })
  async getObservaciones(@Param('actaId') actaId: string) {
    return await this.searchService.getObservaciones(actaId);
  }

  @Post('observaciones/:actaId/regenerar')
  @ApiOperation({
    summary: 'Regenerar observaciones',
    description:
      'Genera nuevas observaciones y las guarda como nueva entrada en el histórico',
  })
  @ApiParam({
    name: 'actaId',
    description: 'ID del acta',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 201,
    description: 'Observaciones regeneradas exitosamente',
  })
  async regenerarObservaciones(@Param('actaId') actaId: string) {
    return await this.searchService.regenerarObservaciones(actaId);
  }
}
