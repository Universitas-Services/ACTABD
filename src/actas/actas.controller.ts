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
  Res, // <-- Importante: para la descarga de archivos
} from '@nestjs/common';
import { ActasService } from './actas.service';
import { ActaDocxService } from './acta-docx.service'; // <-- Importa el nuevo servicio
import { CreateActaDto } from '../auth/dto/create-acta.dto';
import { UpdateActaDto } from '../auth/dto/update-acta.dto';
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
import { Response } from 'express'; // <-- Importante: para la descarga de archivos

@ApiTags('Actas')
@ApiBearerAuth()
@Controller('actas')
@UseGuards(JwtAuthGuard) // Protege todas las rutas de este controlador
export class ActasController {
  // Inyecta AMBOS servicios
  constructor(
    private readonly actasService: ActasService,
    private readonly actaDocxService: ActaDocxService,
  ) {}

  /**
   * Endpoint POST /actas
   * Este endpoint SÓLO guarda el acta en la base de datos.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED) // Devuelve 201 (Creado)
  @ApiOperation({ summary: 'Crear una nueva acta (Solo guarda en BD)' })
  @ApiResponse({
    status: 201,
    description: 'El acta ha sido creada exitosamente.',
  })
  create(@Body() createActaDto: CreateActaDto, @GetUser() user: User) {
    // Llama al servicio que SÓLO guarda en la base de datos
    return this.actasService.create(createActaDto, user);
  }

  /**
   * Endpoint GET /actas
   * Obtiene todas las actas del usuario autenticado.
   */
  @Get()
  @ApiOperation({ summary: 'Obtener todas las actas del usuario' })
  findAll(@GetUser() user: User) {
    return this.actasService.findAllForUser(user);
  }

  /**
   * Endpoint GET /actas/:id
   * Obtiene un acta específica por ID, verificando que pertenezca al usuario.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un acta específica por ID' })
  @ApiParam({ name: 'id', description: 'ID del acta (UUID)', type: 'string' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.actasService.findOneForUser(id, user);
  }

  /**
   * Endpoint PATCH /actas/:id
   * Actualiza un acta específica por ID.
   */
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

  /**
   * Endpoint DELETE /actas/:id
   * Elimina un acta específica por ID.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Devuelve 204 (Sin Contenido)
  @ApiOperation({ summary: 'Eliminar un acta por ID' })
  @ApiResponse({ status: 204, description: 'Acta eliminada exitosamente.' })
  @ApiParam({ name: 'id', description: 'ID del acta (UUID)', type: 'string' })
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.actasService.remove(id, user);
  }

  // ---
  // --- NUEVOS ENDPOINTS DE GENERACIÓN DE DOCX ---
  // ---

  /**
   * NUEVO: Endpoint para Descargar el DOCX
   */
  @Get(':id/descargar-docx')
  @ApiOperation({ summary: 'Genera y descarga el acta como un archivo .docx' })
  @ApiParam({ name: 'id', description: 'ID del acta (UUID)', type: 'string' })
  async descargarDocx(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
    @Res() res: Response, // Inyecta la respuesta de Express
  ) {
    // 1. Obtener el acta de la BD (verifica propiedad)
    const acta = await this.actasService.findOneForUser(id, user);

    // 2. Generar el buffer del .docx
    const buffer = await this.actaDocxService.generarDocxBuffer(acta);

    // 3. Actualizar el estatus a DESCARGADA
    await this.actasService.updateStatus(id, ActaStatus.DESCARGADA);

    // 4. Configurar las cabeceras de la respuesta para la descarga
    const filename = `Acta-${acta.numeroActa}.docx`;
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    // 4. Enviar el buffer
    res.send(buffer);
  }

  /**
   * NUEVO: Endpoint para Enviar el DOCX por Email
   */
  @Post(':id/enviar-docx')
  @HttpCode(HttpStatus.OK) // Devuelve 200 OK
  @ApiOperation({
    summary: 'Genera el .docx y lo envía como adjunto por email',
  })
  @ApiParam({ name: 'id', description: 'ID del acta (UUID)', type: 'string' })
  async enviarDocx(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ) {
    // 1. Obtener el acta de la BD (verifica propiedad)
    const acta = await this.actasService.findOneForUser(id, user);

    // 2. Llamar al servicio para que genere y envíe el email
    await this.actaDocxService.generarYEnviarActa(
      acta,
      user.email,
      user.nombre,
    );

    // 3. Actualizar el estatus a ENVIADA
    await this.actasService.updateStatus(id, ActaStatus.ENVIADA);

    // 4. Devolver una respuesta de éxito
    return {
      statusCode: HttpStatus.OK,
      message:
        'El documento ha sido generado y enviado a tu correo exitosamente.',
    };
  }
}
