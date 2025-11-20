"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RequestForm() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Get current location
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/requests`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        description: (document.getElementById('description') as HTMLTextAreaElement).value,
                        latitude,
                        longitude,
                        priority: 'HIGH',
                        requesterId: 'a1f6b6dc-ad72-49c1-be63-33ad74eb02ec', // Sample user ID from seed
                        status: 'PENDING',
                        trackingId: Math.random().toString(36).substring(7).toUpperCase(),
                    }),
                });

                if (res.ok) {
                    alert('Yêu cầu đã được gửi thành công!');
                } else {
                    alert('Có lỗi xảy ra, vui lòng thử lại.');
                }
                setLoading(false);
            }, (error) => {
                console.error(error);
                alert('Không thể lấy vị trí của bạn. Vui lòng bật GPS.');
                setLoading(false);
            });
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <Card className="w-full border-none shadow-none bg-transparent">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Gửi Yêu Cầu Cứu Hộ</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Họ và tên</Label>
                        <Input id="name" placeholder="Nguyễn Văn A" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input id="phone" placeholder="0912345678" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả sự cố</Label>
                        <Textarea id="description" placeholder="Mô tả chi tiết..." required />
                    </div>
                    <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                        {loading ? "Đang gửi..." : "Gửi Yêu Cầu Khẩn Cấp"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
