import "dotenv/config";
import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
         const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
        super({ adapter });
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
