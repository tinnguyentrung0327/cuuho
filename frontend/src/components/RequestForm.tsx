"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RequestForm() {
    const [loading, setLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    // Resize image to max 800px and compress
    const resizeImage = (file: File, maxWidth = 800): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    // Compress to JPEG with 0.7 quality
                    resolve(canvas.toDataURL('image/jpeg', 0.7));
                };
                img.src = e.target?.result as string;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const convertToBase64 = async (file: File): Promise<string> => {
        if (file.type.startsWith('image/')) {
            // Resize images to reduce payload size
            return await resizeImage(file);
        } else {
            // For videos, just return base64 (can be very large)
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = error => reject(error);
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Get current location
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;

                // Convert selected images to base64 (resized)
                const attachments = await Promise.all(
                    selectedFiles.map(async (file) => ({
                        url: await convertToBase64(file),
                        type: file.type.startsWith('image/') ? 'IMAGE' : 'VIDEO',
                    }))
                );

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/requests`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        description: (document.getElementById('description') as HTMLTextAreaElement).value,
                        address: (document.getElementById('address') as HTMLInputElement).value,
                        contactName: (document.getElementById('name') as HTMLInputElement).value,
                        contactPhone: (document.getElementById('phone') as HTMLInputElement).value,
                        latitude,
                        longitude,
                        priority: 'HIGH',
                        requesterId: 'faea3e45-2b4a-43f2-bbe1-10673ba62d54',
                        trackingId: Math.random().toString(36).substring(7).toUpperCase(),
                        attachments: attachments.length > 0 ? attachments : undefined,
                    }),
                });

                if (res.ok) {
                    const data = await res.json();
                    alert('Yêu cầu đã được gửi thành công! Chuyển đến trang theo dõi...');
                    // Reset form
                    (e.target as HTMLFormElement).reset();
                    setSelectedFiles([]);
                    window.location.href = `/tracking/${data.id}`;
                } else {
                    const errorText = await res.text();
                    console.error('Error:', errorText);
                    alert('Có lỗi xảy ra: ' + errorText);
                }
                setLoading(false);
            }, (error) => {
                console.error(error);
                alert('Không thể lấy vị trí của bạn. Vui lòng bật GPS.');
                setLoading(false);
            });
        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra: ' + error);
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
                        <Label htmlFor="address">Địa chỉ cụ thể</Label>
                        <Input
                            id="address"
                            placeholder="123 Nguyễn Văn Linh, Quận 7, TP.HCM"
                            required
                        />
                        <p className="text-xs text-gray-500">GPS sẽ được tự động xác định</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả sự cố</Label>
                        <Textarea id="description" placeholder="Mô tả chi tiết..." required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="images">Hình ảnh/Video (tùy chọn)</Label>
                        <Input
                            id="images"
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            onChange={handleFileChange}
                            className="cursor-pointer"
                        />
                        {selectedFiles.length > 0 && (
                            <p className="text-sm text-gray-600">
                                {selectedFiles.length} file đã chọn (sẽ được tự động nén)
                            </p>
                        )}
                    </div>
                    <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                        {loading ? "Đang gửi..." : "Gửi Yêu Cầu Khẩn Cấp"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
