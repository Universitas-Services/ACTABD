import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthModule } from '../auth/auth.module';
import { AdminAuthController } from './admin-auth.controller';
import { ActasModule } from '../actas/actas.module'; // <--- Importar
import { ActaComplianceModule } from '../acta-compliance/acta-compliance.module'; // <--- Importar

@Module({
  imports: [
    AuthModule,
    ActasModule, // <--- Añadir
    ActaComplianceModule, // <--- Añadir
  ],
  controllers: [AdminController, AdminAuthController],
  providers: [AdminService],
})
export class AdminModule {}
