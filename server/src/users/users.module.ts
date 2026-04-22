import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AdminService } from '@/admin/admin.service';
import { AdminActionsService } from '@/admin-actions/admin-actions.service';
import { HeatmapService } from '@/heatmap/heatmap.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, AdminService, AdminActionsService, HeatmapService],
})
export class UsersModule { }
