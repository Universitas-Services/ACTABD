// src/auth/auth.service.ts

import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';
import { JwtStrategy } from './strategies/jwt.strategy';
import * as crypto from 'crypto';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config'; // Importa ConfigService
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

  private async getTokens(userId: string, email: string, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, role },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '15m', // Access token de corta duración
        },
      ),
      this.jwtService.signAsync(
        { sub: userId },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
        },
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  // --- 👇 MÉTODO PRIVADO PARA ACTUALIZAR EL REFRESH TOKEN EN LA BD ---
  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken },
    });
  }

  async register(
    createAuthDto: CreateAuthDto,
  ): Promise<Omit<User, 'password'>> {
    const { email, password, nombre, apellido, telefono } = createAuthDto;

    const existingUser: User | null = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    const newUser: User = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nombre,
        apellido,
        telefono,
        confirmationToken: confirmationToken,
      },
    });
    if (newUser) {
      await this.emailService.sendConfirmationEmail(
        newUser.email,
        confirmationToken,
        newUser.nombre,
      );
    }

    return JwtStrategy.excludePassword(newUser);
  }

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user: User | null = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && (await bcrypt.compare(pass, user.password))) {
      return JwtStrategy.excludePassword(user);
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const validatedUser = await this.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!validatedUser) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    // 1. Genera ambos tokens
    const tokens = await this.getTokens(
      validatedUser.id,
      validatedUser.email,
      validatedUser.role,
    );

    // 2. Guarda el hash del nuevo refresh token en la BD
    await this.updateRefreshToken(validatedUser.id, tokens.refresh_token);

    // 3. Devuelve ambos tokens al usuario
    return tokens;
  }

  async confirmEmail(token: string) {
    console.log('Intentando confirmar email con el token:', token);
    const user = await this.prisma.user.findUnique({
      where: { confirmationToken: token },
    });

    if (!user) {
      console.error('No se encontró ningún usuario con el token:', token);
      throw new NotFoundException('Token de confirmación inválido o expirado.');
    }
    console.log('Usuario encontrado para el token:', user.email);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        confirmationToken: null,
      },
    });

    return { message: 'Correo electrónico verificado exitosamente.' };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    // Comprueba si el usuario existe y tiene un token guardado
    if (!user || !user.hashedRefreshToken) {
      throw new ForbiddenException('Acceso denegado');
    }

    // Compara el token proporcionado con el hash de la BD
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Acceso denegado');
    }

    // Si todo es correcto, genera un nuevo par de tokens
    const tokens = await this.getTokens(user.id, user.email, user.role);
    // Actualiza el nuevo refresh token en la BD
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      return {
        message:
          'Si existe una cuenta con este correo, se ha enviado un código de recuperación.',
      };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.user.update({
      where: { email },
      data: { otp, otpExpiresAt },
    });

    await this.emailService.sendPasswordResetOtp(user.email, otp, user.nombre);

    return {
      message:
        'Si existe una cuenta con este correo, se ha enviado un código de recuperación.',
    };
  }

  async verifyOtp(email: string, otp: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (
      !user ||
      !user.otpExpiresAt ||
      user.otp !== otp ||
      new Date() > user.otpExpiresAt
    ) {
      throw new UnauthorizedException('OTP inválido o expirado.');
    }

    await this.prisma.user.update({
      where: { email },
      data: { otp: null, otpExpiresAt: null },
    });

    return { message: 'OTP verificado exitosamente.' };
  }

  async resetPassword(email: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return { message: 'Contraseña actualizada exitosamente.' };
  }
}
