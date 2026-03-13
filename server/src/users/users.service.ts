import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create.user.dto';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateUserDto) {
        return await this.prisma.user.create({ data: dto })
    }
    async findById(id: number) {
        return await this.prisma.user.findUnique({ where: { id } })
    }

    async findByEmail(email: string) {
        return await this.prisma.user.findUnique({ where: { email } })
    }

    async findAll() {
        return await this.prisma.user.findMany()
    }
}
