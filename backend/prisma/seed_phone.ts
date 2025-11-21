import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding request with contact phone...');

    const user = await prisma.user.findUnique({
        where: { email: 'citizen@example.com' },
    });

    if (!user) {
        console.error('User not found');
        return;
    }

    const request = await prisma.rescueRequest.create({
        data: {
            description: 'Yêu cầu cứu hộ test tìm kiếm số điện thoại',
            address: '456 Đường Test, Quận 1, TP.HCM',
            latitude: 10.7769,
            longitude: 106.7009,
            status: 'PENDING',
            priority: 'MEDIUM',
            requesterId: user.id,
            trackingId: Math.random().toString(36).substring(7).toUpperCase(),
            contactName: 'Test User Phone',
            contactPhone: '0999888777'
        },
    });

    console.log(`Created request with contact phone 0999888777. ID: ${request.id}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
