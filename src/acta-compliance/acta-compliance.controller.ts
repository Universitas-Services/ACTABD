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
import { EmailService } from '../email/email.service';
import { Response } from 'express';

@ApiTags('Acta Compliance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('acta-compliance')
export class ActaComplianceController {
  constructor(
    private readonly actaComplianceService: ActaComplianceService,
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
    @GetUser() user: User,
  ) {
    return this.actaComplianceService.create(createActaComplianceDto, user);
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
    return this.actaComplianceService.findAllForUser(user);
  }

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
  async findOne(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.actaComplianceService.findOneForUser(id, user);
  }

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
    @GetUser() user: User,
  ) {
    return this.actaComplianceService.update(id, updateActaComplianceDto, user);
  }

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
  async remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.actaComplianceService.remove(id, user);
  }

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
    const reporte = await this.actaComplianceService.findOneForUser(id, user);
    if (!reporte) {
      // This case should ideally not be reached if findOneForUser throws NotFoundException
      return;
    }
    const buffer = await this.actaComplianceService.generatePdfBuffer(id, user);

    const fileName = `reporte-compliance-${
      reporte.codigo_documento_revisado || reporte.id
    }.pdf`;

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
    const reporte = await this.actaComplianceService.findOneForUser(id, user);
    if (!reporte) {
      // This case should ideally not be reached if findOneForUser throws NotFoundException
      return;
    }
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

    let message = `Reporte enviado exitosamente a ${user.email}`;

    if (
      reporte.correo_electronico &&
      reporte.correo_electronico !== user.email
    ) {
      await this.emailService.sendReportWithAttachment(
        reporte.correo_electronico,
        buffer,
        fileName,
        reporte.nombre_completo_revisor || 'Destinatario',
        reportDate,
      );
      message += ` y a ${reporte.correo_electronico}`;
    }

    return { statusCode: HttpStatus.OK, message: message };
  }
}
