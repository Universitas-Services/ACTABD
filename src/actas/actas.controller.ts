// src/actas/actas.controller.ts

import { Controller, Post, Body, UseGuards, HttpStatus } from '@nestjs/common';
import { ActasService } from './actas.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { CreateActaDto } from '../auth/dto/create-acta.dto';
import type { User } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Actas') // <-- 2. Agrupa bajo la etiqueta "Actas"
@ApiBearerAuth() // <-- 3. Indica que todas las rutas aquí requieren autenticación Bearer (JWT)
@Controller('actas')
@UseGuards(JwtAuthGuard) // Protegemos todas las rutas de este controlador
export class ActasController {
  constructor(private readonly actasService: ActasService) {}

  @Post()
  // 👇 4. Describe el endpoint
  @ApiOperation({ summary: 'Crear una nueva acta' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'El acta ha sido creada exitosamente.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  @Post()
  create(@Body() createActaDto: CreateActaDto, @GetUser() user: User) {
    return this.actasService.create(createActaDto, user);
  }
}
