import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthModule } from '../auth/auth.module'; // Importa AuthModule

@Module({
  imports: [AuthModule], // Importa AuthModule para tener acceso a los guardianes
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
