import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { TaxomonyService } from './taxomony.service';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles';

@UseGuards(RolesGuard)
@Controller('taxomony')
export class TaxomonyController {
  constructor(private readonly taxomonyService: TaxomonyService) { }

  @Get('categories')
  @HttpCode(HttpStatus.OK)
  async getCategories() {
    return await this.taxomonyService.getAllCategories()
  }

  @Get('tags')
  @HttpCode(HttpStatus.OK)

  async getTags() {
    return await this.taxomonyService.getAllTags()
  }

  @Roles('ADMIN')
  @Patch('categories/:id')
  @HttpCode(HttpStatus.OK)
  async updateCategory(@Param('id') id: string, @Body('name') name: string) {
    return await this.taxomonyService.updateCategory(+id, name)
  }

  @Roles('ADMIN')
  @Patch('tags/:id')
  @HttpCode(HttpStatus.OK)
  async updateTag(@Param('id') id: string, @Body('name') name: string) {
    return await this.taxomonyService.updateTag(+id, name)

  }

  @Roles('ADMIN')
  @Post('categories')
  @HttpCode(HttpStatus.CREATED)
  async createCategory(@Body('name') name: string) {
    return await this.taxomonyService.createCategory({ name: name })
  }
  @Roles('ADMIN')
  @Post('categories')
  @HttpCode(HttpStatus.CREATED)
  async createTag(@Body('name') name: string) {
    return await this.taxomonyService.createTag({ name: name })
  }

  @Roles('ADMIN')
  @Delete('categories/:id')
  @HttpCode(HttpStatus.OK)
  async deleteCategory(@Param('id') id: string) {
    return await this.taxomonyService.deleteCategory(+id)
  }
  @Roles('ADMIN')
  @Delete('tags/:id')
  @HttpCode(HttpStatus.OK)
  async deleteTag(@Param('id') id: string) {
    return await this.taxomonyService.deleteTag(+id)
  }
}
