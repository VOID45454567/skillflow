import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CurrentUser } from '@/decorators/current.user.decrator';
import { JwtAuthGuard } from '@/guards/jwt.auth.guard';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }

  @UseGuards(JwtAuthGuard)
  @Post(':courseId')
  async create(
    @Param('courseId') courseId: string,
    @CurrentUser('id') currentUserId: number,
    @Body('text') text: string
  ) {
    console.log(currentUserId);

    return await this.reviewService.create(currentUserId, text, Number(courseId))
  }
}
