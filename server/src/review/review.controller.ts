import { Body, Controller, Param, Post } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CurrentUser } from '@/decorators/current.user.decrator';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }


  @Post(':courseId')
  async create(
    @Param('courseId') courseId: string,
    @CurrentUser('id') currentUserId: number,
    @Body('text') text: string
  ) {
    return await this.reviewService.create(currentUserId, text, Number(courseId))
  }
}
