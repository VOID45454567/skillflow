import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from '@/guards/jwt.auth.guard';
import { Roles as Role } from '@/decorators/roles.decorator'
import { JwtRolesGuard } from '@/guards/roles.guard';

@UseGuards(JwtAuthGuard, JwtRolesGuard)
@Role('ADMIN')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }


  @Get()
  async getAll() {
    return await this.transactionService.getAll()
  }
}
