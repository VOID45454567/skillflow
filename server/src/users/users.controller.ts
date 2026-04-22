import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '@/guards/jwt.auth.guard';
import { CurrentUser } from '@/decorators/current.user.decrator';
import { HeatmapService } from '@/heatmap/heatmap.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly heatmapSrevice: HeatmapService
  ) { }
  @Get()
  async getAll() {
    return await this.usersService.getAll()
  }

  @Get('heatmap/my')
  @UseGuards(JwtAuthGuard)
  async getMyHeatmap(
    @CurrentUser('id') userId: number
  ) {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return await this.heatmapSrevice.getByUserId(userId, startDate, endDate)
  }
  @Get(':id/payments')
  async getUserPayments(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.usersService.getUserPayments(id)
  }
  @Get(':id/transactions')
  async getUserTransactions(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.usersService.getUserTransactions(id)
  }



}
