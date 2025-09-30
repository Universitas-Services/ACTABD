// src/auth/auth.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto'; // Importa el LoginDto

@Controller('auth') // Todas las rutas en este controlador empezarán con /auth
export class AuthController {
  // Inyectamos el AuthService para usar sus métodos
  constructor(private readonly authService: AuthService) {}

  @Post('register') // Define el endpoint POST /auth/register
  async register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }
  @Post('login')
  // Usa el LoginDto aquí también
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // Agregaremos los endpoints de login, logout, etc., más adelante.
}
