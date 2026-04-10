import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateTermDto } from './dto/create.term.dto';
import { UpdateTermDto } from './dto/update.term.dto';

@Injectable()
export class TermsService {
    constructor(
        private readonly prisma: PrismaService
    ) { }


    async getAll() {
        const [categories, tags] = await this.prisma.$transaction([
            this.prisma.term.findMany({ where: { type: 'CATEGORY' } }),
            this.prisma.term.findMany({ where: { type: 'TAG' } })
        ])

        return {
            categories, tags
        }
    }

    async create(dto: CreateTermDto) {
        return await this.prisma.term.create({ data: dto })
    }

    async getById(id: number) {
        return await this.prisma.term.findUnique({ where: { id } })
    }

    async getCategories() {
        return await this.prisma.term.findMany({ where: { type: 'CATEGORY' } })
    }

    async getTags() {
        return await this.prisma.term.findMany({ where: { type: 'TAG' } })
    }

    async update(dto: UpdateTermDto, termId: number) {
        try {
            await this.prisma.term.update({
                where: { id: termId }, data: {
                    name: dto.name,
                    type: dto.type
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    async delete(id: number) {
        return await this.prisma.term.delete({ where: { id } })
    }
}
