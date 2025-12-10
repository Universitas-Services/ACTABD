import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuditAiService } from './audit-ai.service';

@Module({
  imports: [ConfigModule], // Necesario para leer .env
  providers: [AuditAiService],
  exports: [AuditAiService], // ¡Esto permite que otros módulos lo usen!
})
export class AuditModule {}
