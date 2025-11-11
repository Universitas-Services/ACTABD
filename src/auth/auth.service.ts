// src/auth/auth.service.ts

import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';
import { JwtStrategy } from './strategies/jwt.strategy';
import * as crypto from 'crypto';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {
    // Log simple para confirmar que el servicio se carga
    console.log('¡¡¡ AuthService Cargado CORRECTAMENTE !!!');
  }

  /**
   * Genera un nuevo par de Access Token y Refresh Token.
   */
  private async getTokens(userId: string, email: string, role: string) {
    console.log(`[getTokens] User ${userId}: Generando tokens...`); // Log adicional
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, role },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, nonce: crypto.randomBytes(16).toString('hex') },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '7d', // Using a fixed expiration for refresh token
        },
      ),
    ]);
    console.log(`[getTokens] User ${userId}: Tokens generados.`); // Log adicional
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  /**
   * Hashea (con SHA-256) y guarda el Refresh Token en la base de datos.
   * Acepta `null` para borrar el token (logout o invalidación).
   */
  private async updateRefreshTokenHash(
    userId: string,
    refreshToken: string | null,
  ) {
    console.log(
      `[updateRefreshTokenHash] User ${userId}: Intentando actualizar hash SHA-256.`,
    );
    const hashedRefreshToken = refreshToken
      ? crypto.createHash('sha256').update(refreshToken).digest('hex')
      : null;
    console.log(
      `[updateRefreshTokenHash] User ${userId}: Hash SHA-256 a guardar: ${hashedRefreshToken ? hashedRefreshToken.substring(0, 10) + '...' : 'null'}`,
    );
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { hashedRefreshToken },
      });
      console.log(
        `[updateRefreshTokenHash] User ${userId}: Actualización de hash en BD exitosa.`,
      );
    } catch (error) {
      console.error(
        `[updateRefreshTokenHash] User ${userId}: ERROR al actualizar hash en BD:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Registra un nuevo usuario.
   */
  async register(
    createAuthDto: CreateAuthDto,
  ): Promise<Omit<User, 'password'>> {
    const { email, password, nombre, apellido, telefono } = createAuthDto;
    console.log(`[register] Intentando registrar usuario: ${email}`);
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      console.warn(`[register] Usuario ${email} ya existe.`);
      throw new ConflictException('El correo electrónico ya está registrado.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const confirmationToken = crypto.randomBytes(32).toString('hex');

    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nombre,
        apellido,
        telefono,
        confirmationToken: confirmationToken,
      },
    });
    console.log(`[register] Usuario ${email} creado con ID: ${newUser.id}`);

    try {
      await this.emailService.sendConfirmationEmail(
        newUser.email,
        confirmationToken,
        newUser.nombre,
      );
      console.log(`[register] Email de confirmación enviado a ${email}.`);
    } catch (emailError) {
      console.error(
        `[register] ERROR al enviar email de confirmación a ${email}:`,
        emailError,
      );
    }

    return JwtStrategy.excludePassword(newUser);
  }

  /**
   * Valida las credenciales del usuario.
   */
  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    console.log(`[validateUser] Validando credenciales para: ${email}`);
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      console.log(`[validateUser] Credenciales válidas para: ${email}`);
      return JwtStrategy.excludePassword(user);
    }
    console.warn(`[validateUser] Credenciales inválidas para: ${email}`);
    return null;
  }

  /**
   * Inicia sesión, genera tokens y guarda el hash del refresh token.
   */
  async login(loginDto: LoginDto) {
    console.log(`[login] Intentando login para: ${loginDto.email}`);
    const validatedUser = await this.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!validatedUser) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }
    console.log(`[login] Usuario validado: ${validatedUser.id}`);

    const tokens = await this.getTokens(
      validatedUser.id,
      validatedUser.email,
      validatedUser.role,
    );
    console.log(
      `[login] Tokens generados para ${validatedUser.id}. Guardando hash RT...`,
    );
    await this.updateRefreshTokenHash(validatedUser.id, tokens.refresh_token);
    console.log(`[login] Login exitoso para ${validatedUser.id}.`);
    return tokens;
  }

  /**
   * Confirma el email usando un token.
   */
  async confirmEmail(token: string) {
    console.log(
      `[confirmEmail] Intentando confirmar con token: ${token.substring(0, 10)}...`,
    );
    const user = await this.prisma.user.findUnique({
      where: { confirmationToken: token },
    });

    if (!user) {
      console.warn(
        `[confirmEmail] Token no encontrado: ${token.substring(0, 10)}...`,
      );
      throw new NotFoundException('Token de confirmación inválido o expirado.');
    }
    console.log(
      `[confirmEmail] Usuario ${user.id} encontrado para el token. Actualizando...`,
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        confirmationToken: null,
      },
    });
    console.log(`[confirmEmail] Usuario ${user.id} verificado.`);
    return { message: 'Correo electrónico verificado exitosamente.' };
  }

  /**
   * Refresca los tokens (Access y Refresh) usando un Refresh Token válido del body.
   * Implementa la rotación de Refresh Tokens y detección de reutilización.
   */
  async refreshTokens(refreshTokenFromRequest: string) {
    // 1. Validar el token (firma y expiración)
    let payload: { sub: string };
    try {
      payload = await this.jwtService.verifyAsync<{ sub: string }>(
        refreshTokenFromRequest,
        {
          secret: this.configService.get<string>('JWT_SECRET'),
        },
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      console.warn(
        `[refreshTokens] Token inválido o expirado: ${errorMessage}`,
      );
      throw new ForbiddenException('Acceso denegado (Token inválido)');
    }

    const userId = payload.sub;
    console.log(
      `[refreshTokens] User ${userId}: Iniciando proceso de refresh desde body.`,
    );

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, hashedRefreshToken: true },
    });

    // 2. Verifica si el usuario existe y si tiene un hash guardado
    if (!user || !user.hashedRefreshToken) {
      console.warn(
        `[refreshTokens] User ${userId}: No encontrado o sin hash RT guardado. Rechazando. (RF1)`,
      );
      throw new ForbiddenException('Acceso denegado (RF1)');
    }

    // Comparamos el hash del token recibido con el hash guardado en la BD.
    const hashedTokenFromRequest = crypto
      .createHash('sha256')
      .update(refreshTokenFromRequest)
      .digest('hex');
    const refreshTokenMatches =
      hashedTokenFromRequest === user.hashedRefreshToken;
    console.log(
      `[refreshTokens] User ${userId}: Resultado de la comparación de hashes SHA-256: ${refreshTokenMatches}`,
    );

    if (!refreshTokenMatches) {
      console.warn(
        `[refreshTokens] User ${userId}: ¡NO COINCIDEN! Posible reutilización de token detectada. Invalidando sesión. (RF2)`,
      );
      await this.updateRefreshTokenHash(user.id, null);
      throw new ForbiddenException('Acceso denegado (RF2)');
    }

    // 3. El token coincide y es válido. Procedemos con la rotación.
    console.log(
      `[refreshTokens] User ${userId}: Coincidencia exitosa. Generando nuevos tokens...`,
    );
    const newTokens = await this.getTokens(user.id, user.email, user.role);
    console.log(
      `[refreshTokens] User ${userId}: Tokens nuevos generados. Actualizando hash en BD con el nuevo RT...`,
    );

    // 4. Actualizamos la BD con el hash del NUEVO refresh token
    await this.updateRefreshTokenHash(user.id, newTokens.refresh_token);
    console.log(
      `[refreshTokens] User ${userId}: Proceso de refresh completado. Devolviendo nuevos tokens.`,
    );

    // 5. Devolvemos el nuevo par de tokens
    return newTokens;
  }

  /**
   * Envía un OTP para el reseteo de contraseña.
   */
  async forgotPassword(email: string) {
    console.log(`[forgotPassword] Solicitud para: ${email}`);
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.log(
        `[forgotPassword] Usuario ${email} no encontrado (mensaje genérico devuelto).`,
      );
      return {
        message:
          'Si existe una cuenta con este correo, se ha enviado un código de recuperación.',
      };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos
    console.log(
      `[forgotPassword] Generado OTP para ${email}. Guardando en BD...`,
    );

    await this.prisma.user.update({
      where: { email },
      data: { otp, otpExpiresAt },
    });
    console.log(
      `[forgotPassword] OTP guardado para ${email}. Enviando email...`,
    );

    try {
      await this.emailService.sendPasswordResetOtp(user.email, otp);
      console.log(`[forgotPassword] Email con OTP enviado a ${email}.`);
    } catch (emailError) {
      console.error(
        `[forgotPassword] ERROR al enviar OTP a ${email}:`,
        emailError,
      );
    }

    return {
      message:
        'Si existe una cuenta con este correo, se ha enviado un código de recuperación.',
    };
  }

  /**
   * Verifica el OTP recibido.
   */
  async verifyOtp(email: string, otp: string) {
    console.log(`[verifyOtp] Verificando OTP ${otp} para ${email}`);
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (
      !user ||
      !user.otp ||
      !user.otpExpiresAt ||
      user.otp !== otp ||
      new Date() > user.otpExpiresAt
    ) {
      console.warn(
        `[verifyOtp] Verificación fallida para ${email} con OTP ${otp}`,
      );
      throw new UnauthorizedException('OTP inválido o expirado.');
    }
    console.log(
      `[verifyOtp] OTP ${otp} válido para ${email}. Limpiando OTP de BD...`,
    );

    await this.prisma.user.update({
      where: { email },
      data: { otp: null, otpExpiresAt: null },
    });

    console.log(`[verifyOtp] OTP limpiado para ${email}.`);
    return { message: 'OTP verificado exitosamente.' };
  }

  /**
   * Resetea la contraseña del usuario.
   */
  async resetPassword(email: string, newPassword: string) {
    console.log(`[resetPassword] Reseteando contraseña para ${email}`);
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.error(
        `[resetPassword] Usuario ${email} no encontrado durante reseteo.`,
      );
      throw new NotFoundException('Usuario no encontrado.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log(
      `[resetPassword] Nueva contraseña hasheada para ${email}. Actualizando BD...`,
    );
    await this.prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        otp: null,
        otpExpiresAt: null,
      },
    });
    console.log(`[resetPassword] Contraseña actualizada en BD para ${email}.`);
    return { message: 'Contraseña actualizada exitosamente.' };
  }

  /**
   * Cierra la sesión invalidando el hash del refresh token en la BD.
   */
  async logout(userId: string) {
    console.log(`[logout] User ${userId}: Invalidando refresh token.`);
    await this.updateRefreshTokenHash(userId, null);
    console.log(`[logout] User ${userId}: Hash de refresh token borrado.`);
    return { message: 'Sesión cerrada exitosamente.' };
  }
}
