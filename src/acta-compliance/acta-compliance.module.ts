// src/acta-compliance/acta-compliance.module.ts

import { Module } from '@nestjs/common';
import { ActaComplianceService } from './acta-compliance.service';
import { ActaComplianceController } from './acta-compliance.controller';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { AuditModule } from '../audit/audit.module'; // <--- 1. IMPORTAR EL MÓDULO DE AUDITORÍA

@Module({
  imports: [
    AuthModule,
    EmailModule,
    AuditModule, // <--- 2. AÑADIRLO AQUÍ
  ],
  controllers: [ActaComplianceController],
  providers: [ActaComplianceService],
  exports: [ActaComplianceService],
})
export class ActaComplianceModule {}
