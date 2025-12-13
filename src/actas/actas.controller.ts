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
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { User, ActaStatus, UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

// Servicios
import { ActasService } from './actas.service';
import { ActaDocxService } from './acta-docx.service';
import { AuditAiService } from '../audit/audit-ai.service';
import { ActaComplianceService } from '../acta-compliance/acta-compliance.service'; // <--- 1. IMPORTAR ESTE SERVICIO

// DTOs y Guards
import { CreateActaDto } from '../auth/dto/create-acta.dto';
import { UpdateActaDto } from '../auth/dto/update-acta.dto';
import { GetActasFilterDto } from './dto/get-actas-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ACTAS_FINDINGS_MAP } from './actas.constants';

@ApiTags('Actas')
@ApiBearerAuth()
@Controller('actas')
@UseGuards(JwtAuthGuard)
export class ActasController {
  constructor(
    private readonly actasService: ActasService,
    private readonly actaDocxService: ActaDocxService,
    private readonly auditAiService: AuditAiService,
    private readonly actaComplianceService: ActaComplianceService, // <--- 2. INYECTARLO AQUÍ
  ) {}

  // --- ANÁLISIS IA ---
  @Post(':id/analisis-ia')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Analizar riesgos del Acta usando IA' })
  @ApiParam({ name: 'id', description: 'ID del acta (UUID)', type: 'string' })
  async analizarActa(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ) {
    const acta = await this.actasService.findOneForUser(id, user);

    const reporteAnalisis = await this.auditAiService.analyze(
      acta.metadata as Record<string, any>,
      ACTAS_FINDINGS_MAP,
    );

    return {
      message: 'Análisis de Inteligencia Artificial completado.',
      reporte: reporteAnalisis,
    };
  }

  // --- CRUD ACTAS ---

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

  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Obtener TODAS las actas (ADMIN ONLY) con filtros y paginación',
  })
  findAllAdmin(@Query() filterDto: GetActasFilterDto) {
    return this.actasService.findAll(filterDto);
  }

  @Get('admin/stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Obtener estadísticas de las actas (ADMIN ONLY)',
  })
  getStats() {
    return this.actasService.getActasStats();
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

  @Patch(':id/entregar')
  @ApiOperation({ summary: 'Marcar acta como ENTREGADA (Bloquea edición)' })
  @ApiParam({ name: 'id', description: 'ID del acta (UUID)', type: 'string' })
  async entregar(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ) {
    return this.actasService.entregarActa(id, user);
  }

  // --- GENERACIÓN DE DOCUMENTOS (CORREGIDA) ---

  @Get(':id/descargar-docx')
  @ApiOperation({ summary: 'Genera y descarga el acta como un archivo .docx' })
  @ApiParam({ name: 'id', description: 'ID del acta (UUID)', type: 'string' })
  async descargarDocx(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
    @Res() res: Response,
  ) {
    // 1. Obtenemos el acta base
    const acta = await this.actasService.findOneForUser(id, user);

    // --- NUEVA VALIDACIÓN ---
    // Validamos que el acta tenga los datos mínimos requeridos
    const actaConCompletion = acta as typeof acta & { isCompleted: boolean };
    if (!actaConCompletion.isCompleted) {
      throw new BadRequestException(
        'El acta no cumple con los requisitos mínimos (54 datos) para ser descargada.',
      );
    }
    // -------------------------

    // 2. LOGICA DE FUSIÓN: Traer datos del último compliance
    // Buscamos el último checklist creado por el usuario
    const complianceData = await this.actaComplianceService.findAllForUser(
      user,
      { limit: 1, page: 1 },
    );

    let metadataParaDoc = acta.metadata as Record<string, any>;

    // Si existe un checklist, traemos sus detalles completos y mezclamos
    if (complianceData.data && complianceData.data.length > 0) {
      const ultimoCompliance = await this.actaComplianceService.findOneForUser(
        complianceData.data[0].id,
        user,
      );

      metadataParaDoc = {
        ...ultimoCompliance, // Aquí vienen q1, q2... q98
        ...metadataParaDoc, // El metadata del acta tiene prioridad si hay claves repetidas
      };
    }

    // Creamos un objeto temporal fusionado para el generador
    const actaFusionada = { ...acta, metadata: metadataParaDoc };

    // 3. Generamos el documento con la data fusionada
    const buffer = await this.actaDocxService.generarDocxBuffer(actaFusionada);
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
    // 1. Obtenemos el acta base
    const acta = await this.actasService.findOneForUser(id, user);

    // --- NUEVA VALIDACIÓN ---
    // Validamos que el acta tenga los datos mínimos requeridos
    const actaConCompletion = acta as typeof acta & { isCompleted: boolean };
    if (!actaConCompletion.isCompleted) {
      throw new BadRequestException(
        'El acta no cumple con los requisitos mínimos (54 datos) para ser enviada.',
      );
    }
    // -------------------------

    // 2. LOGICA DE FUSIÓN (Misma que arriba)
    const complianceData = await this.actaComplianceService.findAllForUser(
      user,
      { limit: 1, page: 1 },
    );

    let metadataParaDoc = acta.metadata as Record<string, any>;

    if (complianceData.data && complianceData.data.length > 0) {
      const ultimoCompliance = await this.actaComplianceService.findOneForUser(
        complianceData.data[0].id,
        user,
      );
      metadataParaDoc = {
        ...ultimoCompliance,
        ...metadataParaDoc,
      };
    }

    const actaFusionada = { ...acta, metadata: metadataParaDoc };

    // 3. Enviamos el documento con la data fusionada
    await this.actaDocxService.generarYEnviarActa(
      actaFusionada,
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
