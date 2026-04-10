import { Body, Controller, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { CurrentUser } from '@/decorators/current.user.decrator';
import { JwtAuthGuard } from '@/guards/jwt.auth.guard';

@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) { }


  @Patch('/up')
  @UseGuards(JwtAuthGuard)
  async deposit(@Body('count', ParseIntPipe) currencyCount: number, @CurrentUser('id') userId: string) {
    return await this.balanceService.deposit(Number(userId), currencyCount)
  }
}
