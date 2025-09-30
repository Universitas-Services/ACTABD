// src/users/users.controller.ts

import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator'; // 1. Importa el nuevo decorador
import type { User } from '@prisma/client';

@Controller('users') // Todas las rutas aquí empezarán con /users
@UseGuards(JwtAuthGuard) // ¡Protegemos TODO el controlador!
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile') // La ruta será GET /users/profile
  getProfile(@GetUser() user: User) {
    // Ahora 'user' está fuertemente tipado y el linter está feliz
    return user;
  }
}
