import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [AuthModule], // 2. Añádelo a la lista de imports
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
