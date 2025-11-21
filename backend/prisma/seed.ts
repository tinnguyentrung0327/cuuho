import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Create a sample user
    // Check if user exists with email but wrong ID
    const existingUser = await prisma.user.findUnique({ where: { email: 'citizen@example.com' } });
    if (existingUser && existingUser.id !== 'faea3e45-2b4a-43f2-bbe1-10673ba62d54') {
        console.log('Deleting existing user with wrong ID...');
        await prisma.user.delete({ where: { email: 'citizen@example.com' } });
    }

    // Create or update the sample user
    const user = await prisma.user.upsert({
        where: { id: 'faea3e45-2b4a-43f2-bbe1-10673ba62d54' },
        update: {},
        create: {
            id: 'faea3e45-2b4a-43f2-bbe1-10673ba62d54',
            email: 'citizen@example.com',
            password: 'password123',
            fullName: 'Nguyen Van A',
            phone: '0912345678',
            role: 'CITIZEN',
        },
    });

    console.log('Created user:', user);

    // Create a sample rescue team
    const team = await prisma.rescueTeam.upsert({
        where: { id: 'sample-team-id' },
        update: {},
        create: {
            id: 'sample-team-id',
            name: 'Đội Cứu Hộ 115',
            description: 'Đội cứu hộ khẩn cấp Hà Nội',
            status: 'ACTIVE',
        },
    });

    console.log('Created team:', team);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
