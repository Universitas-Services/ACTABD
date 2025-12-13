// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthModule } from '../auth/auth.module';
import { AdminAuthController } from './admin-auth.controller'; // <--- Importar

@Module({
  imports: [AuthModule],
  controllers: [AdminController, AdminAuthController], // <--- Añadir aquí
  providers: [AdminService], // Asegúrate de que AdminService esté aquí
})
export class AdminModule {}
