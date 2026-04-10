import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CurrentUser } from '@/decorators/current.user.decrator';
import { JwtAuthGuard } from '@/guards/jwt.auth.guard';
import { JwtRolesGuard } from '@/guards/roles.guard';
import { Roles as Role } from '@/decorators/roles.decorator'
import { SetVerificationStatusDto } from './dto/set.verification.status.dto';

@UseGuards(JwtAuthGuard, JwtRolesGuard)
@Role('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Get('users-verif-pending')
  async getUsersOnVerification() {
    return await this.adminService.getUsersOnVerification()
  }

  @Get('transactions/all')
  async getTransactions() {
    return await this.adminService.getTransactions()
  }

  @Get('terms/all')
  async getTagsAndCategories() {
    return await this.adminService.getTagsAndCategories()
  }

  @Get('payments/all')
  async getPayments() {
    return await this.adminService.getPayments()
  }

  @Patch('block-user/:id')
  async blockUser(@Param('id') userId: string, @CurrentUser('id') adminId: number, @Body('reason') reason: string) {
    return await this.adminService.blockUser(Number(userId), adminId, reason)
  }

  @Patch('unblock-user/:id')
  async unblockUser(@Param('id') userId: string, @CurrentUser('id') adminId: number, @Body('reason') reason: string) {
    return await this.adminService.unblockUser(Number(userId), adminId, reason)
  }

  @Patch('user-verifiacation/set/:id')
  async setVerificationStatus(
    @CurrentUser('id') id: number,
    @Param('id') userId: string,
    @Body() setVerifDto: SetVerificationStatusDto

  ) {
    return await this.adminService.setVerificationStatus(id, Number(userId), setVerifDto)
  }

  @Get('payments/:id')
  async getUserPayments(@Param('id') id: string) {
    return await this.adminService.getUserPayments(Number(id))
  }
  @Get('transactions/:id')
  async getUserTrasactions(@Param('id') id: string) {
    return await this.adminService.getUserTransactions(Number(id))
  }
}
