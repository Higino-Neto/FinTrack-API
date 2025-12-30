import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [AuthModule]
})
export class UsersModule {}
