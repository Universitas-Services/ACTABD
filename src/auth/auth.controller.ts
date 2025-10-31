// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Get,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

// --- 👇 AÑADE ESTAS TRES LÍNEAS DE IMPORTACIÓN ---
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto'; // Importar el nuevo DTO

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';
interface RequestWithAccessTokenPayload extends Request {
  user: {
    id: string;
    // ...otros campos...
  };
}

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
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

  @Get('confirm-email/:token')
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
    return this.authService.confirmEmail(token);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Solicitar reseteo de contraseña' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verificar el código OTP' })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Restablecer la contraseña con un nuevo valor' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.newPassword,
    );
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refrescar tokens (rotación) usando el body' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Nuevos tokens generados.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Refresh token inválido/expirado.',
  })
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }

  // --- 👇👇👇 AÑADE ESTE MÉTODO PARA LOGOUT 👇👇👇 ---
  @UseGuards(JwtAuthGuard) // Protegido por el access token
  @ApiBearerAuth()
  @Post('logout')
  @ApiOperation({ summary: 'Cerrar sesión (invalidar refresh token)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Sesión cerrada.' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  async logout(@Req() req: RequestWithAccessTokenPayload) {
    // Usa la interfaz correcta
    const userId = req.user.id;
    return this.authService.logout(userId); // Llama al servicio
  }
}
