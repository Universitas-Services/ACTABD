// src/acta-compliance/acta-compliance.module.ts
import { Module } from '@nestjs/common';
import { ActaComplianceService } from './acta-compliance.service';
import { ActaComplianceController } from './acta-compliance.controller';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module'; // <-- 1. IMPORTAR

@Module({
  imports: [AuthModule, EmailModule], // <-- 2. AÑADIR EmailModule
  controllers: [ActaComplianceController],
  providers: [ActaComplianceService],
  exports: [ActaComplianceService],
})
export class ActaComplianceModule {}
