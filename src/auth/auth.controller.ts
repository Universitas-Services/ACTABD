// src/auth/auth.controller.ts
import { Controller, Post, Body, HttpStatus, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
// --- 👇 1. Importa los decoradores de Swagger ---
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Autenticación') // <-- Agrupa todos los endpoints de este controlador bajo "Autenticación"
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  // --- 👇 2. Decora el endpoint ---
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuario registrado exitosamente.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'El correo electrónico ya está registrado.',
  })
  async register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  // --- 👇 3. Decora también el login ---
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login exitoso, devuelve un token de acceso.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Credenciales inválidas.',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('confirm-email/:token') // Define la ruta con un parámetro 'token'
  @ApiOperation({ summary: 'Confirmar el correo electrónico de un usuario' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Correo electrónico verificado exitosamente.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Token inválido o expirado.',
  })
  async confirmEmail(@Param('token') token: string) {
    // @Param('token') extrae el token de la URL
    return this.authService.confirmEmail(token);
  }
}
