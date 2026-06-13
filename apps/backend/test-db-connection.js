import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./src/generated/prisma/client.ts";

async function testConnection() {
    try {
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
        });

        const prisma = new PrismaClient({ adapter });

        await prisma.$connect();
        console.log('✅ Successfully connected to MySQL database!');

        const result = await prisma.$queryRaw`SELECT DATABASE() as db_name`;
        console.log(`📋 Connected to database: ${result[0].db_name}`);

        await prisma.$disconnect();
        console.log('✅ Connection test completed successfully');
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
}

testConnection();