// src/auth/strategies/refresh-token.strategy.ts

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh', // Le damos un nombre único
) {
  constructor(config: ConfigService) {
    // --- 👇 ESTA ES LA CORRECCIÓN ---
    // 1. Lee la variable de entorno primero
    const jwtRefreshSecret = config.get<string>('JWT_REFRESH_SECRET');

    // 2. Verifica que exista antes de continuar
    if (!jwtRefreshSecret) {
      throw new Error('JWT_REFRESH_SECRET no está definido en el archivo .env');
    }

    // 3. Ahora puedes usar la variable segura en super()
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtRefreshSecret, // TypeScript ahora sabe que esto es un 'string'
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: { sub: string }) {
    const refreshToken = req.get('Authorization')?.replace('Bearer', '').trim();

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token malformado o ausente');
    }

    // Ahora el tipo de retorno es '{ sub: string, refreshToken: string }', que es seguro.
    return { ...payload, refreshToken };
  }
}
