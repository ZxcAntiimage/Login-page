const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
    try {
        await prisma.$connect();
        console.log('✅ Successfully connected to MySQL database!');

        // Test a simple query
        const users = await prisma.user.findMany();
        console.log(`📊 Found ${users.length} users in the database`);

        // Test database info
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