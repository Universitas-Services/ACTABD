// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module'; // <-- ¡Impórtalo aquí!
import { UsersModule } from './users/users.module';
import { ActasModule } from './actas/actas.module';
import { EmailModule } from './email/email.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ActasModule,
    EmailModule,
    AiModule, // <-- ¡Y añádelo a la lista de imports!
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
