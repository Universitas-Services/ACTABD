import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { Global } from '@nestjs/common';
@Global()
@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
