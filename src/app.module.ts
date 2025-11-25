// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module'; // <-- ¡Impórtalo aquí!
import { UsersModule } from './users/users.module';
import { ActasModule } from './actas/actas.module';
import { EmailModule } from './email/email.module';
import { AiModule } from './ai/ai.module';
import { TasksModule } from './tasks/tasks.module';
//import { AdminModule } from './admin/admin.module';
import { AdminModule } from './admin/admin.module';
import { ActaComplianceModule } from './acta-compliance/acta-compliance.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    ActasModule,
    EmailModule,
    AiModule,
    TasksModule, // <-- ¡Y añádelo a la lista de imports!
    //AdminModule, // Añade AdminModule si existe
    TasksModule,
    AdminModule,
    ActaComplianceModule,
    AuditModule, // <-- 4. Añade TasksModule
    AuditModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
