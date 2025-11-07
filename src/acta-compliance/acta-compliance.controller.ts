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
  Res, // <-- 2. IMPORTAR
} from '@nestjs/common';
import { ActaComplianceService } from './acta-compliance.service';
import { CreateActaComplianceDto } from './dto/create-acta-compliance.dto';
import { UpdateActaComplianceDto } from './dto/update-acta-compliance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
// --- 3. AÑADIR IMPORTS ---
import { EmailService } from '../email/email.service'; // Para enviar correos
import { Response } from 'express'; // Para la descarga de archivos

@ApiTags('Acta Compliance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('acta-compliance')
export class ActaComplianceController {
  constructor(
    private readonly actaComplianceService: ActaComplianceService,
    // --- 4. INYECTAR EmailService ---
    private readonly emailService: EmailService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo checklist de cumplimiento' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Checklist creado exitosamente.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  create(
    @Body() createActaComplianceDto: CreateActaComplianceDto,
    @GetUser() user: User, // Obtiene el usuario autenticado
  ) {
    // Pasa el ID del usuario al servicio
    return this.actaComplianceService.create(createActaComplianceDto, user.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los checklists (Admin - considera restringir)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de todos los checklists.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  findAll() {
    // Advertencia: Esto devuelve TODOS los checklists.
    return this.actaComplianceService.findAll();
  }

  @Get('my-checklists')
  @ApiOperation({
    summary: 'Obtener todos mis checklists de cumplimiento creados',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de los checklists del usuario.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  findAllForUser(@GetUser() user: User) {
    // Busca solo los checklists asociados al usuario autenticado
    return this.actaComplianceService.findAllForUser(user.id);
  }

  // --- REVISADO: Añadir @GetUser para verificar propiedad ---
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un checklist de cumplimiento por su ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del checklist (UUID)',
    type: String,
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Checklist encontrado.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Checklist no encontrado.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User, // <-- AÑADIDO
  ) {
    // AHORA verificamos que el checklist pertenece al usuario
    return this.actaComplianceService.findOneForUser(id, user.id);
  }

  // --- REVISADO: Añadir @GetUser para verificar propiedad ---
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un checklist de cumplimiento por su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del checklist (UUID)',
    type: String,
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Checklist actualizado.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Checklist no encontrado.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateActaComplianceDto: UpdateActaComplianceDto,
    @GetUser() user: User, // <-- AÑADIDO
  ) {
    // AHORA verificamos que el usuario es dueño antes de actualizar
    return this.actaComplianceService.update(
      id,
      updateActaComplianceDto,
      user.id,
    );
  }

  // --- REVISADO: Añadir @GetUser para verificar propiedad ---
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un checklist de cumplimiento por su ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del checklist (UUID)',
    type: String,
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Checklist eliminado.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Checklist no encontrado.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User, // <-- AÑADIDO
  ) {
    // AHORA verificamos que el usuario es dueño antes de eliminar
    return this.actaComplianceService.remove(id, user.id);
  }

  // ---
  // --- 5. ENDPOINTS NUEVOS PARA PDF ---
  // ---

  @Get(':id/download')
  @ApiOperation({ summary: 'Descargar el reporte en PDF' })
  @ApiParam({
    name: 'id',
    description: 'ID del Reporte (UUID)',
    type: 'string',
  })
  @ApiResponse({ status: 200, description: 'Descarga del archivo PDF.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Reporte no encontrado.' })
  async downloadReport(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
    @Res() res: Response,
  ) {
    // Llama al nuevo método del servicio
    const { buffer, reporte } =
      await this.actaComplianceService.generatePdfBuffer(id, user.id);

    const fileName = `reporte-compliance-${reporte.codigo_documento_revisado || reporte.id}.pdf`;

    // Configura la respuesta para forzar la descarga
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(buffer);
  }

  @Post(':id/email')
  @ApiOperation({ summary: 'Enviar el reporte por email al usuario' })
  @ApiParam({
    name: 'id',
    description: 'ID del Reporte (UUID)',
    type: 'string',
  })
  @ApiResponse({ status: 200, description: 'Reporte enviado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Reporte no encontrado.' })
  async emailReport(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ) {
    // 1. Genera el PDF
    const { buffer, reporte } =
      await this.actaComplianceService.generatePdfBuffer(id, user.id);

    const subject = `Reporte de Compliance: ${reporte.nombre_organo_entidad || 'Auditoría'}`;
    const fileName = `reporte-${reporte.codigo_documento_revisado || reporte.id}.pdf`;

    // 2. Llama al servicio de Email (que actualizaremos)
    await this.emailService.sendReportWithAttachment(
      user.email, // Envía al usuario autenticado
      user.nombre,
      subject,
      buffer,
      fileName,
    );

    let message = `Reporte enviado exitosamente a ${user.email}`;

    // 3. Opcional: enviar al correo guardado en el reporte
    if (
      reporte.correo_electronico &&
      reporte.correo_electronico !== user.email
    ) {
      await this.emailService.sendReportWithAttachment(
        reporte.correo_electronico,
        reporte.nombre_completo_revisor || 'Destinatario',
        subject,
        buffer,
        fileName,
      );
      message += ` y a ${reporte.correo_electronico}`;
    }

    return { statusCode: HttpStatus.OK, message: message };
  }
}
