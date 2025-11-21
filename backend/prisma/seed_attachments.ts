import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding request with attachments...');

    const user = await prisma.user.findUnique({
        where: { email: 'citizen@example.com' },
    });

    if (!user) {
        console.error('User not found');
        return;
    }

    const request = await prisma.rescueRequest.create({
        data: {
            description: 'Yêu cầu cứu hộ có hình ảnh minh họa',
            address: '123 Đường Test, Quận 1, TP.HCM',
            latitude: 10.7769,
            longitude: 106.7009,
            status: 'PENDING',
            priority: 'MEDIUM',
            requesterId: user.id,
            trackingId: Math.random().toString(36).substring(7).toUpperCase(),
            attachments: {
                create: [
                    {
                        url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1000&auto=format&fit=crop',
                        type: 'IMAGE'
                    },
                    {
                        url: 'https://images.unsplash.com/photo-1605218427368-35b08968e2e9?q=80&w=1000&auto=format&fit=crop',
                        type: 'IMAGE'
                    }
                ]
            }
        },
    });

    console.log(`Created request with attachments. ID: ${request.id}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
