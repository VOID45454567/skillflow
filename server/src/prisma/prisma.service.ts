import { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "../../prisma/generated/prisma/index";
import { ConfigService } from "@nestjs/config";



export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor(
        private readonly configService: ConfigService
    ) {
        super({
            datasourceUrl: process.env.DATABASE_URL,
        });
    }
    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}