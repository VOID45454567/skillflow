import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersService } from '@/users/users.service';
import { AdminActionsService } from '@/admin-actions/admin-actions.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, UsersService, AdminActionsService],
})
export class AdminModule { }
