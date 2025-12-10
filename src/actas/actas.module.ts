// src/actas/actas.module.ts

import { Module } from '@nestjs/common';
import { ActasService } from './actas.service';
import { ActasController } from './actas.controller';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { ActaDocxService } from './acta-docx.service';
import { AuditModule } from '../audit/audit.module';
import { ActaComplianceModule } from '../acta-compliance/acta-compliance.module'; // <--- 1. IMPORTAR ESTO

@Module({
  imports: [
    AuthModule,
    EmailModule,
    AuditModule,
    ActaComplianceModule, // <--- 2. AÑADIRLO AL ARRAY DE IMPORTS
  ],
  controllers: [ActasController],
  providers: [ActasService, ActaDocxService],
})
export class ActasModule {}
