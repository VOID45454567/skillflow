import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaxomonyDto } from './dto/create.taxomony.dto';

@Injectable()
export class TaxomonyService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async getAllCategories() {
        return await this.prisma.categories.findMany()
    }

    async getAllTags() {
        return await this.prisma.tags.findMany()
    }

    async createCategory(dto: CreateTaxomonyDto) {
        return await this.prisma.categories.create({
            data: {
                name: dto.name
            }
        })
    }

    async createTag(dto: CreateTaxomonyDto) {
        return await this.prisma.tags.create({
            data: {
                name: dto.name
            }
        })
    }

    async updateTag(id: number, name: string) {
        return await this.prisma.tags.update({
            where: { id }, data: {
                name: name
            }
        })
    }

    async updateCategory(id: number, name: string) {
        return await this.prisma.categories.update({
            where: { id }, data: {
                name: name
            }
        })
    }

    async deleteCategory(id: number) {
        return await this.prisma.categories.delete({ where: { id } })
    }

    async deleteTag(id: number) {
        return await this.prisma.tags.delete({ where: { id } })

    }
}
