// src/email/email.module.ts

import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule } from '@nestjs/config'; // <-- 1. IMPORTA ConfigModule

@Module({
  imports: [
    ConfigModule, // <-- 2. AÑADE ConfigModule A LOS IMPORTS
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
