// src/tasks/tasks.module.ts

import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { EmailModule } from '../email/email.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, EmailModule],
  providers: [TasksService],
})
export class TasksModule {}
