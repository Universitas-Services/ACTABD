/* eslint-disable */
// src/acta-compliance/acta-compliance.controller.ts
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
  HttpStatus,
  Res,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { User } from '@prisma/client';

// Servicios
import { ActaComplianceService } from './acta-compliance.service';
import { EmailService } from '../email/email.service';
import { AuditAiService } from '../audit/audit-ai.service'; // <--- 1. IMPORTAR SERVICIO IA

// DTOs y Constantes
import { CreateActaComplianceDto } from './dto/create-acta-compliance.dto';
import { UpdateActaComplianceDto } from './dto/update-acta-compliance.dto';
import { GetComplianceFilterDto } from './dto/get-compliance-filter.dto';
import { FINDINGS_MAP } from './acta-compliance.constants'; // <--- 2. IMPORTAR MAPA DE PREGUNTAS
import { ActaStatus } from '@prisma/client';
// Guards y Decoradores
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Acta Compliance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('acta-compliance')
export class ActaComplianceController {
  constructor(
    private readonly actaComplianceService: ActaComplianceService,
    private readonly emailService: EmailService,
    private readonly auditAiService: AuditAiService, // <--- 3. INYECTAR AQUÍ
  ) {}

  // --- 👇 NUEVO ENDPOINT PARA ANÁLISIS CON IA 👇 ---
  @Post(':id/analisis-ia')
  @ApiOperation({ summary: 'Generar análisis de riesgos con IA basado en leyes' })
  @ApiResponse({ status: 200, description: 'Análisis generado correctamente.' })
  async runAiAnalysis(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ) {
    // 1. Buscamos el acta de compliance en la BD
    const compliance = await this.actaComplianceService.findOneForUser(id, user);

    // 2. Ejecutamos el análisis con el servicio de IA
    // Le pasamos los datos (compliance) y el mapa de preguntas (FINDINGS_MAP)
    // Hacemos un cast a 'any' o 'Record<string, any>' para que coincida con la firma del servicio genérico
    const reporteAnalisis = await this.auditAiService.analyze(
      compliance as unknown as Record<string, any>, 
      FINDINGS_MAP
    );

    // 3. Devolvemos el reporte al frontend
    return {
      message: 'Análisis de Inteligencia Artificial completado.',
      reporte: reporteAnalisis
    };
  }
  // ------------------------------------------------------

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo checklist de cumplimiento' })
  create(
    @Body() createActaComplianceDto: CreateActaComplianceDto,
    @GetUser() user: User,
  ) {
    return this.actaComplianceService.create(createActaComplianceDto, user);
  }

  @Get('my-checklists')
  @ApiOperation({
    summary: 'Obtener todos mis checklists (con paginación y filtros)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista paginada de checklists.',
  })
  findAllForUser(
    @GetUser() user: User,
    @Query() filterDto: GetComplianceFilterDto,
  ) {
    return this.actaComplianceService.findAllForUser(user, filterDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.actaComplianceService.findOneForUser(id, user);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateActaComplianceDto: UpdateActaComplianceDto,
    @GetUser() user: User,
  ) {
    return this.actaComplianceService.update(id, updateActaComplianceDto, user);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.actaComplianceService.remove(id, user);
  }

  @Get(':id/download')
  async downloadReport(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
    @Res() res: Response,
  ) {
    const reporte = await this.actaComplianceService.findOneForUser(id, user);
    if (!reporte) return;
    
    const buffer = await this.actaComplianceService.generatePdfBuffer(id, user);
    await this.actaComplianceService.updateStatus(id, ActaStatus.DESCARGADA);
    const fileName = `reporte-compliance-${
      reporte.codigo_documento_revisado || reporte.id
    }.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(buffer);
  }

  @Post(':id/email')
  async emailReport(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ) {
     const reporte = await this.actaComplianceService.findOneForUser(id, user);
    if (!reporte) return;
    
    const buffer = await this.actaComplianceService.generatePdfBuffer(id, user);

    const fileName = `reporte-${
      reporte.codigo_documento_revisado || reporte.id
    }.pdf`;
    const reportDate = new Date(
      reporte.fecha_revision || Date.now(),
    ).toLocaleDateString('es-ES');

    await this.emailService.sendReportWithAttachment(
      user.email,
      buffer,
      fileName,
      user.nombre,
      reportDate,
    );
    await this.actaComplianceService.updateStatus(id, ActaStatus.ENVIADA);
    return { statusCode: HttpStatus.OK, message: 'Reporte enviado' };
  }
}