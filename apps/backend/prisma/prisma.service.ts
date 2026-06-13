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
            ssl: { rejectUnauthorized: false },
            permitInsecurePlugin: true
        } as any);
        
        super({ adapter });
    }

    async onModuleInit() {
        await this.$connect();
        try {
            await this.$executeRawUnsafe(`
                CREATE TABLE IF NOT EXISTS \`User\` (
                    \`id\` INT NOT NULL AUTO_INCREMENT,
                    \`email\` VARCHAR(191) NOT NULL,
                    \`password\` VARCHAR(191) NOT NULL,
                    \`firstName\` VARCHAR(191) NULL,
                    \`lastName\` VARCHAR(191) NULL,
                    \`phone\` VARCHAR(191) NULL,
                    \`verificationCode\` VARCHAR(191) NULL,
                    \`verificationCodeExp\` DATETIME(3) NULL,
                    \`emailVerified\` TINYINT(1) NOT NULL DEFAULT 0,
                    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                    UNIQUE INDEX \`User_email_key\`(\`email\`),
                    PRIMARY KEY (\`id\`)
                ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
            `);
            console.log("🚀 Таблица User успешно проверена/создана в Aiven!");
        } catch (error) {
            console.error("❌ Не удалось создать таблицу User через SQL:", error);
        }
    }
}
