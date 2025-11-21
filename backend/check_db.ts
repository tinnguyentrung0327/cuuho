import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        // Query to get current database name
        const dbNameResult: any = await prisma.$queryRaw`SELECT current_database();`;
        console.log('Current Database Name:', dbNameResult[0].current_database);

        // Query to get all table names in public schema
        const tablesResult = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;

        console.log('Tables in database:');
        console.table(tablesResult);

        // Count records in User table to verify seed
        const userCount = await prisma.user.count();
        console.log(`Total Users: ${userCount}`);

        const specificUser = await prisma.user.findUnique({
            where: { id: 'faea3e45-2b4a-43f2-bbe1-10673ba62d54' }
        });
        console.log('Specific User (faea...):', specificUser ? 'FOUND ✅' : 'NOT FOUND ❌');


    } catch (error) {
        console.error('Error connecting to database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
