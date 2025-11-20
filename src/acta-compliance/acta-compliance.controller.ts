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
  Query, // 1. IMPORTAR QUERY
} from '@nestjs/common';
import { ActaComplianceService } from './acta-compliance.service';
import { CreateActaComplianceDto } from './dto/create-acta-compliance.dto';
import { UpdateActaComplianceDto } from './dto/update-acta-compliance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '@prisma/client';
// 2. IMPORTAR EL DTO
import { GetComplianceFilterDto } from './dto/get-compliance-filter.dto'; 
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
  // ... (Decoradores existentes)
  create(
    @Body() createActaComplianceDto: CreateActaComplianceDto,
    @GetUser() user: User,
  ) {
    return this.actaComplianceService.create(createActaComplianceDto, user);
  }

  // 👇 3. MÉTODO ACTUALIZADO
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
    @Query() filterDto: GetComplianceFilterDto, // Inyección de Query Params
  ) {
    return this.actaComplianceService.findAllForUser(user, filterDto);
  }
  // 👆 ----------------------

  // ... (El resto de métodos findOne, update, remove, download, email se quedan IGUAL)
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
    
    // Generar buffer (usando tu servicio existente)
    // NOTA: Asegúrate que el servicio tenga el método generatePdfBuffer completo
    const buffer = await this.actaComplianceService.generatePdfBuffer(id, user);

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
    // ... (Tu lógica existente de email) ...
    // Copia el contenido de tu controlador anterior para este método
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
    
    return { statusCode: HttpStatus.OK, message: 'Reporte enviado' };
  }
}