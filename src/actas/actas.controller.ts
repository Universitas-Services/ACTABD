// src/actas/actas.controller.ts

import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  Get, // <-- Añadir
  Param, // <-- Añadir
  Patch, // <-- Añadir
  Delete, // <-- Añadir
  ParseUUIDPipe, // <-- Añadir para validar IDs
} from '@nestjs/common';
import { ActasService } from './actas.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { CreateActaDto } from '../auth/dto/create-acta.dto';
import { UpdateActaDto } from '../auth/dto/update-acta.dto'; // <-- Importar DTO
import type { User } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam, // <-- Añadir
} from '@nestjs/swagger';

@ApiTags('Actas')
@ApiBearerAuth()
@Controller('actas')
@UseGuards(JwtAuthGuard) // Protegemos todas las rutas
export class ActasController {
  constructor(private readonly actasService: ActasService) {}

  // --- Endpoint POST (Crear) que ya tenías ---
  @Post()
  @ApiOperation({ summary: 'Crear una nueva acta' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'El acta ha sido creada exitosamente.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  create(@Body() createActaDto: CreateActaDto, @GetUser() user: User) {
    return this.actasService.create(createActaDto, user);
  }

  // --- NUEVOS ENDPOINTS CRUD ---

  /**
   * CONSULTAR TODAS (Read All)
   * Endpoint: GET /actas
   */
  @Get()
  @ApiOperation({ summary: 'Obtener todas las actas del usuario' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Devuelve un arreglo de actas.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  findAll(@GetUser() user: User) {
    return this.actasService.findAllForUser(user);
  }

  /**
   * CONSULTAR UNA (Read One)
   * Endpoint: GET /actas/:id
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un acta específica por ID' })
  @ApiParam({ name: 'id', description: 'ID del acta (UUID)', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Devuelve el acta solicitada.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'El acta no existe.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'No tienes permiso para ver esta acta.',
  })
  findOne(
    @Param('id', ParseUUIDPipe) id: string, // Valida que el ID sea un UUID
    @GetUser() user: User,
  ) {
    return this.actasService.findOneForUser(id, user);
  }

  /**
   * ACTUALIZAR (Update)
   * Endpoint: PATCH /actas/:id
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un acta específica por ID' })
  @ApiParam({ name: 'id', description: 'ID del acta (UUID)', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'El acta ha sido actualizada.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'El acta no existe.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'No tienes permiso para editar esta acta.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateActaDto: UpdateActaDto,
    @GetUser() user: User,
  ) {
    return this.actasService.update(id, updateActaDto, user);
  }

  /**
   * ELIMINAR (Delete)
   * Endpoint: DELETE /actas/:id
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un acta específica por ID' })
  @ApiParam({ name: 'id', description: 'ID del acta (UUID)', type: 'string' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'El acta ha sido eliminada.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'El acta no existe.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'No tienes permiso para eliminar esta acta.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.actasService.remove(id, user);
  }
}
