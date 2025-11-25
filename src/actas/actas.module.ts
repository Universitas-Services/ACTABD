// src/actas/actas.module.ts

import { Module } from '@nestjs/common';
import { ActasService } from './actas.service';
import { ActasController } from './actas.controller';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { ActaDocxService } from './acta-docx.service';
import { AuditModule } from '../audit/audit.module'; // <--- 1. IMPORTAR AuditModule

@Module({
  imports: [
    AuthModule,
    EmailModule,
    AuditModule, // <--- 2. AÑADIRLO AQUI
  ],
  controllers: [ActasController],
  providers: [ActasService, ActaDocxService],
})
export class ActasModule {}
