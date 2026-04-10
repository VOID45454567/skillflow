import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { JwtStrategy } from '@/strategies/passport.jwt.strategy';
import { JwtAuthGuard } from '@/guards/jwt.auth.guard';
import { TransactionService } from '@/transaction/transaction.service';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService, JwtStrategy, JwtAuthGuard, TransactionService],
})
export class CoursesModule { }
