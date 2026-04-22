import { Body, Controller, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { CurrentUser } from '@/decorators/current.user.decrator';
import { JwtAuthGuard } from '@/guards/jwt.auth.guard';
import { UpBalanceDto } from './dto/up.balance.dto';

@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) { }


  @Patch('up')
  @UseGuards(JwtAuthGuard)
  async deposit(@Body() dto: UpBalanceDto, @CurrentUser('id') userId: number) {
    return await this.balanceService.deposit({ ...dto, userId })
  }
}
