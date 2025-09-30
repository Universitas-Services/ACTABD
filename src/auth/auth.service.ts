// src/auth/auth.service.ts

import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';
import { JwtStrategy } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(
    createAuthDto: CreateAuthDto,
  ): Promise<Omit<User, 'password'>> {
    const { email, password, nombre, apellido, telefono } = createAuthDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nombre,
        apellido,
        telefono,
      },
    });

    // Llama al método estático desde JwtStrategy
    return JwtStrategy.excludePassword(newUser);
  }

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(pass, user.password))) {
      // Llama al método estático desde JwtStrategy
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

    const payload = {
      sub: validatedUser.id,
      email: validatedUser.email,
      role: validatedUser.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
