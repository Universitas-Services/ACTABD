import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  Param,
} from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post('analyze-acta')
  async analyzeActa(@Body('actaId') actaId: string) {
    if (!actaId) {
      throw new BadRequestException('Debes enviar un "actaId"');
    }
    // Genera y guarda observaciones en la base de datos
    return await this.searchService.analyzeAndSave(actaId);
  }

  @Get('observaciones/:actaId')
  async getObservaciones(@Param('actaId') actaId: string) {
    // Devuelve la última observación guardada
    return await this.searchService.getObservaciones(actaId);
  }

  @Get('observaciones/:actaId/all')
  async getAllObservaciones(@Param('actaId') actaId: string) {
    // Devuelve todas las observaciones (histórico)
    return await this.searchService.getAllObservaciones(actaId);
  }

  @Post('observaciones/:actaId/regenerar')
  async regenerarObservaciones(@Param('actaId') actaId: string) {
    // Regenera observaciones y guarda como nueva entrada
    return await this.searchService.regenerarObservaciones(actaId);
  }
}
