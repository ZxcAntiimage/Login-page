import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "../src/generated/prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit{
    constructor(){
        const adapter = new PrismaMariaDb({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        connectionLimit: 5,
        ssl: {rejectUnauthorized: false},
        connectTimeout: 10000,
        acquireTimeout: 10000,
        });
        super({adapter})
    }

    async onModuleInit() {
        await this.$connect();
    }
}