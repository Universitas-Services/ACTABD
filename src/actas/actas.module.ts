// src/actas/actas.module.ts

import { Module } from '@nestjs/common';
import { ActasService } from './actas.service';
import { ActasController } from './actas.controller';
import { AuthModule } from '../auth/auth.module'; // ¡Importante!
import { EmailModule } from '../email/email.module'; // <-- 1. IMPORTA EmailModule
import { ActaDocxService } from './acta-docx.service'; // <-- 2. IMPORTA el nuevo servicio
@Module({
  // Importamos AuthModule para tener acceso al JwtAuthGuard y la estrategia JWT
  imports: [AuthModule, EmailModule],
  controllers: [ActasController],
  providers: [ActasService, ActaDocxService],
})
export class ActasModule {}
