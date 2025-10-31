// src/acta-compliance/acta-compliance.module.ts
import { Module } from '@nestjs/common';
import { ActaComplianceService } from './acta-compliance.service';
import { ActaComplianceController } from './acta-compliance.controller';
import { AuthModule } from '../auth/auth.module'; // <-- Asegúrate de que esta línea esté

@Module({
  imports: [AuthModule], // <-- Asegúrate de que AuthModule esté en los imports
  controllers: [ActaComplianceController],
  providers: [ActaComplianceService],
  exports: [ActaComplianceService],
})
export class ActaComplianceModule {}
