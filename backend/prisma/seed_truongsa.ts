import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding Truong Sa request...');

    // Find the default user
    const user = await prisma.user.findUnique({
        where: { email: 'citizen@example.com' },
    });

    if (!user) {
        console.error('User citizen@example.com not found. Please run seed.ts first.');
        return;
    }

    const request = await prisma.rescueRequest.create({
        data: {
            description: 'Yêu cầu cứu hộ khẩn cấp tại Trường Sa (Khánh Hòa)',
            address: 'Trường Sa (Khánh Hòa)',
            latitude: 10.7233,
            longitude: 115.8265,
            status: 'PENDING',
            priority: 'HIGH',
            requesterId: user.id,
            trackingId: Math.random().toString(36).substring(7).toUpperCase(),
        },
    });

    console.log(`Created request for Trường Sa with ID: ${request.id}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
