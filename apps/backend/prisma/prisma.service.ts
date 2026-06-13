import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "../src/generated/prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        const adapter = new PrismaMariaDb({
            host: process.env.DATABASE_HOST,
            port: process.env.DATABASE_PORT ? Number(process.env.DATABASE_PORT) : 11294,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            connectionLimit: 5,
            useTextProtocol: true,
            connectTimeout: 15000,
            acquireTimeout: 15000,
            ssl: { 
                rejectUnauthorized: false 
            },
            
            permitInsecurePlugin: true 
        } as any);
        
        super({ adapter });
    }

    async onModuleInit() {
        await this.$connect();
    }
}
