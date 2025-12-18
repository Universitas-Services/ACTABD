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
import { User, UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

// Servicios
import { ActaComplianceService } from './acta-compliance.service';
import { EmailService } from '../email/email.service';
import { AuditAiService } from '../audit/audit-ai.service'; // <--- 1. IMPORTAR SERVICIO IA

// DTOs y Constantes
import { CreateActaComplianceDto } from './dto/create-acta-compliance.dto';
import { UpdateActaComplianceDto } from './dto/update-acta-compliance.dto';
import { GetComplianceFilterDto } from './dto/get-compliance-filter.dto';
import { ActaComplianceAdminInfoResponseDto } from './dto/acta-compliance-admin-info-response.dto';
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
  ) { }

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

  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Obtener TODAS las auditorías (ADMIN ONLY) con filtros',
  })
  findAllAdmin(@Query() filterDto: GetComplianceFilterDto) {
    return this.actaComplianceService.findAll(filterDto);
  }

  @Get('admin/stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Obtener estadísticas de auditorías (ADMIN ONLY)',
  })
  getStats() {
    return this.actaComplianceService.getStats();
  }

  @Get('admin/:id/info')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Obtener información específica de cumplimiento formateada (ADMIN ONLY)',
  })
  @ApiResponse({
    status: 200,
    description: 'Información formateada de cumplimiento.',
    type: ActaComplianceAdminInfoResponseDto,
  })
  getAdminInfo(@Param('id', ParseUUIDPipe) id: string) {
    return this.actaComplianceService.getComplianceInfoForAdmin(id);
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

  @Get('admin/:id/download')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async adminDownloadReport(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    const reporte = await this.actaComplianceService.findOneById(id);

    const buffer = await this.actaComplianceService.generatePdfBufferAdmin(id);
    await this.actaComplianceService.updateStatus(id, ActaStatus.DESCARGADA);

    // Forzamos el tipado ANY para acceder a propiedades sin problemas
    const reporteAny = reporte as any;
    const fileName = `reporte-compliance-ADMIN-${reporteAny.codigo_documento_revisado || reporte.id}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(buffer);
  }

  @Post('admin/:id/email')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async adminEmailReport(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ) {
    const reporte = await this.actaComplianceService.findOneById(id);
    const buffer = await this.actaComplianceService.generatePdfBufferAdmin(id);

    // Forzamos el tipado ANY
    const reporteAny = reporte as any;
    const fileName = `reporte-${reporteAny.codigo_documento_revisado || reporte.id}.pdf`;

    // PRIORITY: Correo del registro > Correo del admin (Fallback)
    const emailDestino = reporteAny.correo_electronico || user.email;

    await this.emailService.sendComplianceReport(
      emailDestino,
      buffer,
      fileName,
      reporte.numeroCompliance || 'S/N',
      reporte.puntajeCalculado || 0,
    );

    await this.actaComplianceService.updateStatus(id, ActaStatus.ENVIADA);
    return { statusCode: HttpStatus.OK, message: 'Reporte enviado por Admin' };
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
    const fileName = `reporte-compliance-${reporte.codigo_documento_revisado || reporte.id
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

    const fileName = `reporte-${reporte.codigo_documento_revisado || reporte.id
      }.pdf`;
    const reportDate = new Date(
      reporte.fecha_revision || Date.now(),
    ).toLocaleDateString('es-ES');

    // PRIORITY: Correo del registro > Correo del usuario (Fallback)
    const emailDestino = reporte.correo_electronico || user.email;

    await this.emailService.sendComplianceReport(
      emailDestino,
      buffer,
      fileName,
      reporte.numeroCompliance || 'S/N',
      reporte.puntajeCalculado || 0,
    );
    await this.actaComplianceService.updateStatus(id, ActaStatus.ENVIADA);
    return { statusCode: HttpStatus.OK, message: 'Reporte enviado' };
  }
}