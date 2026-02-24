import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from '../auth/dto/login.dto';
import { RefreshTokenDto } from '../auth/dto/refresh-token.dto';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
}

@ApiTags('Admin Auth')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión como Administrador' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login exitoso, devuelve tokens.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Credenciales inválidas o no es administrador.',
  })
  async login(@Body() loginDto: LoginDto) {
    // 1. Validar credenciales
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    // 2. Verificar rol de ADMIN explícitamente
    if (user.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('No tienes permisos de administrador.');
    }

    // 3. Generar tokens (usando el mismo método de login que ya maneja la creación de tokens)
    // Nota: AuthService.login vuelve a validar, pero es seguro.
    // Para ser más eficientes, podríamos refactorizar AuthService para separar validación de generación,
    // pero para mantener la consistencia usaremos login() y el guard de arriba ya filtró por rol.
    // Sin embargo, AuthService.login NO chequea rol, así que si solo llamamos a login,
    // técnicamente estamos logueando. Pero aquí ya validamos el rol.
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refrescar tokens de Administrador' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Nuevos tokens generados.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Token inválido o usuario no es admin.',
  })
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refreshTokens(
      refreshTokenDto.refreshToken,
      UserRole.ADMIN, // <--- REQUISITO CRÍTICO: Forzar rol ADMIN
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener datos del administrador actual' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Datos del admin recuperados.',
  })
  getMe(@Req() req: RequestWithUser) {
    return {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      // Puedes agregar nombre si está disponible en el payload del token o extender el guard para traerlo
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar sesión de administrador' })
  async logout(@Req() req: RequestWithUser) {
    return this.authService.logout(req.user.id);
  }
}
