import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const provinces = [
    { name: "Hà Nội", lat: 21.0285, lng: 105.8542 },
    { name: "Hồ Chí Minh", lat: 10.8231, lng: 106.6297 },
    { name: "Hải Phòng", lat: 20.8449, lng: 106.6881 },
    { name: "Đà Nẵng", lat: 16.0544, lng: 108.2022 },
    { name: "Cần Thơ", lat: 10.0452, lng: 105.7469 },
    { name: "An Giang", lat: 10.5216, lng: 105.1259 },
    { name: "Bà Rịa - Vũng Tàu", lat: 10.4963, lng: 107.1685 },
    { name: "Bắc Giang", lat: 21.2731, lng: 106.1946 },
    { name: "Bắc Kạn", lat: 22.1470, lng: 105.8348 },
    { name: "Bạc Liêu", lat: 9.2941, lng: 105.7278 },
    { name: "Bắc Ninh", lat: 21.1861, lng: 106.0763 },
    { name: "Bến Tre", lat: 10.2417, lng: 106.3754 },
    { name: "Bình Định", lat: 13.9411, lng: 109.1060 },
    { name: "Bình Dương", lat: 11.1606, lng: 106.6693 },
    { name: "Bình Phước", lat: 11.7511, lng: 106.9083 },
    { name: "Bình Thuận", lat: 11.0902, lng: 108.0087 },
    { name: "Cà Mau", lat: 9.1769, lng: 105.1524 },
    { name: "Cao Bằng", lat: 22.6565, lng: 106.2620 },
    { name: "Đắk Lắk", lat: 12.6667, lng: 108.0383 },
    { name: "Đắk Nông", lat: 12.0000, lng: 107.6833 },
    { name: "Điện Biên", lat: 21.3905, lng: 103.0152 },
    { name: "Đồng Nai", lat: 10.9423, lng: 106.8244 },
    { name: "Đồng Tháp", lat: 10.4568, lng: 105.6440 },
    { name: "Gia Lai", lat: 13.9833, lng: 108.0000 },
    { name: "Hà Giang", lat: 22.8233, lng: 104.9839 },
    { name: "Hà Nam", lat: 20.5451, lng: 105.9135 },
    { name: "Hà Tĩnh", lat: 18.3560, lng: 105.9042 },
    { name: "Hải Dương", lat: 20.9373, lng: 106.3146 },
    { name: "Hậu Giang", lat: 9.7833, lng: 105.4667 },
    { name: "Hòa Bình", lat: 20.8133, lng: 105.3383 },
    { name: "Hưng Yên", lat: 20.6464, lng: 106.0511 },
    { name: "Khánh Hòa", lat: 12.2388, lng: 109.1967 },
    { name: "Kiên Giang", lat: 10.0120, lng: 105.0809 },
    { name: "Kon Tum", lat: 14.3500, lng: 108.0000 },
    { name: "Lai Châu", lat: 22.3975, lng: 103.4606 },
    { name: "Lâm Đồng", lat: 11.9404, lng: 108.4583 },
    { name: "Lạng Sơn", lat: 21.8538, lng: 106.7614 },
    { name: "Lào Cai", lat: 22.4856, lng: 103.9707 },
    { name: "Long An", lat: 10.5364, lng: 106.4125 },
    { name: "Nam Định", lat: 20.4179, lng: 106.1621 },
    { name: "Nghệ An", lat: 19.2343, lng: 104.8764 },
    { name: "Ninh Bình", lat: 20.2539, lng: 105.9750 },
    { name: "Ninh Thuận", lat: 11.5657, lng: 108.9881 },
    { name: "Phú Thọ", lat: 21.3228, lng: 105.2155 },
    { name: "Phú Yên", lat: 13.0882, lng: 109.3149 },
    { name: "Quảng Bình", lat: 17.4833, lng: 106.6000 },
    { name: "Quảng Nam", lat: 15.5667, lng: 107.9833 },
    { name: "Quảng Ngãi", lat: 15.1205, lng: 108.7923 },
    { name: "Quảng Ninh", lat: 21.0069, lng: 107.2925 },
    { name: "Quảng Trị", lat: 16.7500, lng: 107.0000 },
    { name: "Sóc Trăng", lat: 9.6033, lng: 105.9800 },
    { name: "Sơn La", lat: 21.3277, lng: 103.9172 },
    { name: "Tây Ninh", lat: 11.3667, lng: 106.1167 },
    { name: "Thái Bình", lat: 20.4461, lng: 106.3364 },
    { name: "Thái Nguyên", lat: 21.5942, lng: 105.8482 },
    { name: "Thanh Hóa", lat: 19.8075, lng: 105.7764 },
    { name: "Thừa Thiên Huế", lat: 16.4637, lng: 107.5909 },
    { name: "Tiền Giang", lat: 10.4333, lng: 106.3500 },
    { name: "Trà Vinh", lat: 9.9347, lng: 106.3453 },
    { name: "Tuyên Quang", lat: 21.8239, lng: 105.2172 },
    { name: "Vĩnh Long", lat: 10.2542, lng: 105.9722 },
    { name: "Vĩnh Phúc", lat: 21.3093, lng: 105.6047 },
    { name: "Yên Bái", lat: 21.7055, lng: 104.8753 },
    // Adding one more to make it 64 as requested
    { name: "Hoàng Sa (Đà Nẵng)", lat: 16.3333, lng: 111.6667 }
];

async function main() {
    console.log(`Start seeding ${provinces.length} requests...`);

    // Find the default user
    const user = await prisma.user.findUnique({
        where: { email: 'citizen@example.com' },
    });

    if (!user) {
        console.error('User citizen@example.com not found. Please run seed.ts first.');
        return;
    }

    for (const province of provinces) {
        const request = await prisma.rescueRequest.create({
            data: {
                description: `Yêu cầu cứu hộ khẩn cấp tại ${province.name}`,
                address: province.name,
                latitude: province.lat,
                longitude: province.lng,
                status: 'PENDING',
                priority: 'HIGH',
                requesterId: user.id,
                trackingId: Math.random().toString(36).substring(7).toUpperCase(),
            },
        });
        console.log(`Created request for ${province.name} with ID: ${request.id}`);
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
