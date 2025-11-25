// src/actas/actas.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Res,
  Query,
} from '@nestjs/common';
import { ActasService } from './actas.service';
import { ActaDocxService } from './acta-docx.service';
import { AuditAiService } from '../audit/audit-ai.service'; // <--- 1. IMPORTAR SERVICIO IA
import { ACTAS_FINDINGS_MAP } from './actas.constants'; // <--- 2. IMPORTAR MAPA DE PREGUNTAS

import { CreateActaDto } from '../auth/dto/create-acta.dto';
import { UpdateActaDto } from '../auth/dto/update-acta.dto';
import { GetActasFilterDto } from './dto/get-actas-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User, ActaStatus } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Actas')
@ApiBearerAuth()
@Controller('actas')
@UseGuards(JwtAuthGuard)
export class ActasController {
  constructor(
    private readonly actasService: ActasService,
    private readonly actaDocxService: ActaDocxService,
    private readonly auditAiService: AuditAiService, // <--- 3. INYECTAR AQUÍ
  ) {}

  // --- 👇 NUEVO ENDPOINT PARA ANÁLISIS CON IA EN ACTAS 👇 ---
  @Post(':id/analisis-ia')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Analizar riesgos del Acta usando IA' })
  @ApiParam({ name: 'id', description: 'ID del acta (UUID)', type: 'string' })
  async analizarActa(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ) {
    // 1. Obtener el acta
    const acta = await this.actasService.findOneForUser(id, user);

    // 2. Ejecutar análisis enviando el metadata (JSON) y el mapa de preguntas
    // Hacemos cast a Record<string, any> porque metadata es Json en Prisma
    const reporteAnalisis = await this.auditAiService.analyze(
      acta.metadata as Record<string, any>,
      ACTAS_FINDINGS_MAP,
    );

    return {
      message: 'Análisis de Inteligencia Artificial completado.',
      reporte: reporteAnalisis,
    };
  }
  // ----------------------------------------------------------

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva acta (Solo guarda en BD)' })
  @ApiResponse({
    status: 201,
    description: 'El acta ha sido creada exitosamente.',
  })
  create(@Body() createActaDto: CreateActaDto, @GetUser() user: User) {
    return this.actasService.create(createActaDto, user);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las actas del usuario (con filtros y paginación)',
  })
  findAll(@GetUser() user: User, @Query() filterDto: GetActasFilterDto) {
    return this.actasService.findAllForUser(user, filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un acta específica por ID' })
  @ApiParam({ name: 'id', description: 'ID del acta (UUID)', type: 'string' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.actasService.findOneForUser(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un acta por ID' })
  @ApiParam({ name: 'id', description: 'ID del acta (UUID)', type: 'string' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateActaDto: UpdateActaDto,
    @GetUser() user: User,
  ) {
    return this.actasService.update(id, updateActaDto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un acta por ID' })
  @ApiResponse({ status: 204, description: 'Acta eliminada exitosamente.' })
  @ApiParam({ name: 'id', description: 'ID del acta (UUID)', type: 'string' })
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.actasService.remove(id, user);
  }

  @Get(':id/descargar-docx')
  @ApiOperation({ summary: 'Genera y descarga el acta como un archivo .docx' })
  @ApiParam({ name: 'id', description: 'ID del acta (UUID)', type: 'string' })
  async descargarDocx(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
    @Res() res: Response,
  ) {
    const acta = await this.actasService.findOneForUser(id, user);
    const buffer = await this.actaDocxService.generarDocxBuffer(acta);
    await this.actasService.updateStatus(id, ActaStatus.DESCARGADA);

    const filename = `Acta-${acta.numeroActa}.docx`;
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(buffer);
  }

  @Post(':id/enviar-docx')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Genera el .docx y lo envía como adjunto por email',
  })
  @ApiParam({ name: 'id', description: 'ID del acta (UUID)', type: 'string' })
  async enviarDocx(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ) {
    const acta = await this.actasService.findOneForUser(id, user);
    await this.actaDocxService.generarYEnviarActa(
      acta,
      user.email,
      user.nombre,
    );
    await this.actasService.updateStatus(id, ActaStatus.ENVIADA);

    return {
      statusCode: HttpStatus.OK,
      message:
        'El documento ha sido generado y enviado a tu correo exitosamente.',
    };
  }
}
