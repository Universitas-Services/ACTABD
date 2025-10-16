// src/auth/auth.service.ts

import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';
import { EmailService } from '../email/email.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import * as crypto from 'crypto';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

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
      try {
        // --- 👇 4. Pasa el token recién generado al servicio de email ---
        await this.emailService.sendConfirmationEmail(
          newUser.email,
          confirmationToken, // Usa la variable local del token
          newUser.nombre,
        );
      } catch (error: any) {
        console.error('Error al enviar el correo de confirmación:', error);
      }
    }

    // Llama al método estático desde JwtStrategy
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
      // Llama al método estático desde JwtStrategy
      return JwtStrategy.excludePassword(user);
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const validatedUser: Omit<User, 'password'> | null =
      await this.validateUser(loginDto.email, loginDto.password);
    if (!validatedUser) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }
    const payload = {
      sub: validatedUser.id,
      email: validatedUser.email,
      role: validatedUser.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async confirmEmail(token: string) {
    // 1. Busca al usuario por el token de confirmación
    const user = await this.prisma.user.findUnique({
      where: { confirmationToken: token },
    });

    // 2. Si no se encuentra un usuario, el token es inválido o ya fue usado
    if (!user) {
      throw new NotFoundException('Token de confirmación inválido o expirado.');
    }

    // 3. Actualiza al usuario: marca el email como verificado y borra el token
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        confirmationToken: null, // ¡Importante! Invalida el token para que no se use de nuevo
      },
    });

    return { message: 'Correo electrónico verificado exitosamente.' };
  }
}
