// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // Importamos el JwtModule de forma asíncrona para poder usar el ConfigService

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // Leemos el secreto desde el archivo .env
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '3h' }, // El token expirará en 3 horas
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
