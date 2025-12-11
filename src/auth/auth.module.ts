// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy'; // Importa la nueva estrategia
import { EmailModule } from '../email/email.module'; // Importa EmailModule

@Module({
  imports: [
    EmailModule, // Añade EmailModule a los imports
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '50m' }, // Expiración corta para el access token
      }),
    }),
  ],
  controllers: [AuthController], // <-- AÑADE UNA COMA AQUÍ
  providers: [AuthService, JwtStrategy, RefreshTokenStrategy], // Esta es la línea que estabas añadiendo
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
