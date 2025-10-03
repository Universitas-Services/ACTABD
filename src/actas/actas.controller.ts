// src/actas/actas.controller.ts

import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ActasService } from './actas.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { CreateActaDto } from '../auth/dto/create-acta.dto';
import type { User } from '@prisma/client';

@Controller('actas')
@UseGuards(JwtAuthGuard) // Protegemos todas las rutas de este controlador
export class ActasController {
  constructor(private readonly actasService: ActasService) {}

  @Post()
  create(@Body() createActaDto: CreateActaDto, @GetUser() user: User) {
    return this.actasService.create(createActaDto, user);
  }
}
