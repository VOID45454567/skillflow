import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { TermsService } from './terms.service';
import { CreateTermDto } from './dto/create.term.dto';
import { JwtAuthGuard } from '@/guards/jwt.auth.guard';
import { JwtRolesGuard } from '@/guards/roles.guard';
import { Roles as Role } from '@/decorators/roles.decorator';
import { Roles } from '../../prisma/generated/prisma';
import { UpdateTermDto } from './dto/update.term.dto';

@Controller('terms')
export class TermsController {
  constructor(private readonly termsService: TermsService) { }


  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll() {
    return await this.termsService.getAll()
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Role(Roles.ADMIN)
  async create(@Body() dto: CreateTermDto) {
    return await this.termsService.create(dto)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Role(Roles.ADMIN)
  @HttpCode(HttpStatus.OK)
  async update(@Body() dto: UpdateTermDto, @Param('id') id: string) {
    const existing = await this.termsService.getById(Number(id))
    if (!existing) {
      throw new NotFoundException('Такого тега/категории нет')
    }
    return await this.termsService.update(dto, Number(id))
  }

  @Get('categories')
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Role(Roles.ADMIN)
  @HttpCode(HttpStatus.OK)
  async getCategories() {
    return await this.termsService.getCategories()
  }


  @Get('tags')
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Role(Roles.ADMIN)
  @HttpCode(HttpStatus.OK)
  async getTags() {
    return await this.termsService.getTags()
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  @Role(Roles.ADMIN)
  async delete(@Param('id') id: string) {
    return await this.termsService.delete(Number(id))
  }
}
