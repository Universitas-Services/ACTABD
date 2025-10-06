// src/actas/actas.module.ts

import { Module } from '@nestjs/common';
import { ActasService } from './actas.service';
import { ActasController } from './actas.controller';
import { AuthModule } from '../auth/auth.module'; // ¡Importante!

@Module({
  // Importamos AuthModule para tener acceso al JwtAuthGuard y la estrategia JWT
  imports: [AuthModule],
  controllers: [ActasController],
  providers: [ActasService],
})
export class ActasModule {}
