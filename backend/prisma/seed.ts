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

    // Sample data for Vietnam provinces
    const provinces = [
        { name: 'Hà Nội', lat: 21.0285, lng: 105.8542 },
        { name: 'Hồ Chí Minh', lat: 10.8231, lng: 106.6297 },
        { name: 'Đà Nẵng', lat: 16.0544, lng: 108.2022 },
        { name: 'Hải Phòng', lat: 20.8449, lng: 106.6881 },
        { name: 'Cần Thơ', lat: 10.0452, lng: 105.7469 },
        { name: 'An Giang', lat: 10.5216, lng: 105.1259 },
        { name: 'Bà Rịa - Vũng Tàu', lat: 10.4114, lng: 107.1362 },
        { name: 'Bắc Giang', lat: 21.2731, lng: 106.1946 },
        { name: 'Bắc Kạn', lat: 22.1470, lng: 105.8348 },
        { name: 'Bạc Liêu', lat: 9.2941, lng: 105.7278 },
        { name: 'Bắc Ninh', lat: 21.1861, lng: 106.0763 },
        { name: 'Bến Tre', lat: 10.2417, lng: 106.3742 },
        { name: 'Bình Định', lat: 13.7820, lng: 109.2192 },
        { name: 'Bình Dương', lat: 11.1602, lng: 106.6737 },
        { name: 'Bình Phước', lat: 11.7511, lng: 106.9098 },
        { name: 'Bình Thuận', lat: 11.0872, lng: 108.0048 },
        { name: 'Cà Mau', lat: 9.1769, lng: 105.1524 },
        { name: 'Cao Bằng', lat: 22.6565, lng: 106.2566 },
        { name: 'Đắk Lắk', lat: 12.6667, lng: 108.0500 },
        { name: 'Đắk Nông', lat: 12.0000, lng: 107.6833 },
        { name: 'Điện Biên', lat: 21.3833, lng: 103.0167 },
        { name: 'Đồng Nai', lat: 10.9422, lng: 106.8164 },
        { name: 'Đồng Tháp', lat: 10.4533, lng: 105.6386 },
        { name: 'Gia Lai', lat: 13.9833, lng: 108.0000 },
        { name: 'Hà Giang', lat: 22.8333, lng: 104.9833 },
        { name: 'Hà Nam', lat: 20.5833, lng: 105.9167 },
        { name: 'Hà Tĩnh', lat: 18.3333, lng: 105.9000 },
        { name: 'Hải Dương', lat: 20.9333, lng: 106.3167 },
        { name: 'Hậu Giang', lat: 9.7833, lng: 105.4667 },
        { name: 'Hòa Bình', lat: 20.8167, lng: 105.3333 },
        { name: 'Hưng Yên', lat: 20.6500, lng: 106.0500 },
        { name: 'Khánh Hòa', lat: 12.2500, lng: 109.1833 },
        { name: 'Kiên Giang', lat: 10.0167, lng: 105.0833 },
        { name: 'Kon Tum', lat: 14.3500, lng: 108.0000 },
        { name: 'Lai Châu', lat: 22.4000, lng: 103.4667 },
        { name: 'Lâm Đồng', lat: 11.9500, lng: 108.4333 },
        { name: 'Lạng Sơn', lat: 21.8500, lng: 106.7667 },
        { name: 'Lào Cai', lat: 22.4833, lng: 103.9667 },
        { name: 'Long An', lat: 10.5333, lng: 106.4000 },
        { name: 'Nam Định', lat: 20.4167, lng: 106.1667 },
        { name: 'Nghệ An', lat: 19.2500, lng: 104.8833 },
        { name: 'Ninh Bình', lat: 20.2500, lng: 105.9667 },
        { name: 'Ninh Thuận', lat: 11.5667, lng: 108.9833 },
        { name: 'Phú Thọ', lat: 21.3167, lng: 105.2167 },
        { name: 'Phú Yên', lat: 13.0833, lng: 109.0833 },
        { name: 'Quảng Bình', lat: 17.4833, lng: 106.6000 },
        { name: 'Quảng Nam', lat: 15.5667, lng: 107.9667 },
        { name: 'Quảng Ngãi', lat: 15.1167, lng: 108.8000 },
        { name: 'Quảng Ninh', lat: 21.0000, lng: 107.2000 },
        { name: 'Quảng Trị', lat: 16.8000, lng: 107.1000 },
        { name: 'Sóc Trăng', lat: 9.6000, lng: 105.9667 },
        { name: 'Sơn La', lat: 21.3333, lng: 103.9167 },
        { name: 'Tây Ninh', lat: 11.3000, lng: 106.1000 },
        { name: 'Thái Bình', lat: 20.4500, lng: 106.3333 },
        { name: 'Thái Nguyên', lat: 21.5667, lng: 105.8333 },
        { name: 'Thanh Hóa', lat: 19.8000, lng: 105.7667 },
        { name: 'Thừa Thiên Huế', lat: 16.4667, lng: 107.6000 },
        { name: 'Tiền Giang', lat: 10.3500, lng: 106.3500 },
        { name: 'Trà Vinh', lat: 9.9333, lng: 106.3333 },
        { name: 'Tuyên Quang', lat: 21.8167, lng: 105.2167 },
        { name: 'Vĩnh Long', lat: 10.2500, lng: 105.9667 },
        { name: 'Vĩnh Phúc', lat: 21.3000, lng: 105.6000 },
        { name: 'Yên Bái', lat: 21.7167, lng: 104.8667 },
    ];

    console.log(`Seeding requests for ${provinces.length} provinces...`);

    for (const province of provinces) {
        // Randomize status
        const statuses = ['PENDING', 'ASSIGNED', 'ON_THE_WAY', 'RESOLVED'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

        // Randomize priority
        const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
        const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];

        await prisma.rescueRequest.create({
            data: {
                trackingId: `REQ-${province.name.toUpperCase().replace(/\s/g, '').substring(0, 3)}-${Math.floor(Math.random() * 1000)}`,
                description: `Cần hỗ trợ khẩn cấp tại ${province.name} (Mô phỏng)`,
                address: `Trung tâm ${province.name}, Việt Nam`,
                latitude: province.lat + (Math.random() * 0.05 - 0.025), // Add small random offset
                longitude: province.lng + (Math.random() * 0.05 - 0.025),
                status: randomStatus as any,
                priority: randomPriority,
                contactName: 'Người dân địa phương',
                contactPhone: '0900000000',
                requester: {
                    connect: { id: user.id }
                }
            }
        });
    }
    console.log('Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
