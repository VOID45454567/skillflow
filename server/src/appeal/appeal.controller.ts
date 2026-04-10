import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AppealService } from './appeal.service';
import { CurrentUser } from '@/decorators/current.user.decrator';
import { JwtAuthGuard } from '@/guards/jwt.auth.guard';

@Controller('appeal')
export class AppealController {
  constructor(private readonly appealService: AppealService) {
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body('text') text: string,
    @Body('banInfoId') banInfoId: string,
    @CurrentUser('id') userId: number
  ) {
    return await this.appealService.create(Number(banInfoId), text, userId)
  }
}
