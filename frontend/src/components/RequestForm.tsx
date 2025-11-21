"use client";
import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { User, Phone, MapPin, FileVideo, Loader2, Send, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RequestForm() {
    const [loading, setLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isSubmitted, setIsSubmitted] = useState(false);

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
                        // requesterId is now optional and handled by backend for guests
                        trackingId: Math.random().toString(36).substring(7).toUpperCase(),
                        attachments: attachments.length > 0 ? attachments : undefined,
                    }),
                });

                if (res.ok) {
                    const data = await res.json();
                    setIsSubmitted(true);
                    setTimeout(() => {
                        window.location.href = `/tracking/${data.id}`;
                    }, 1500);
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

    if (isSubmitted) {
        return (
            <Card className="w-full border-none shadow-xl bg-white p-8 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <Send className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Đã Gửi Yêu Cầu!</h2>
                    <p className="text-gray-600">Đang chuyển hướng đến trang theo dõi...</p>
                </motion.div>
            </Card>
        );
    }

    return (
        <Card className="w-full border-none shadow-2xl bg-white overflow-hidden">
            <CardHeader className="bg-red-600 text-white p-6">
                <div className="flex items-center justify-center space-x-2">
                    <AlertTriangle className="w-6 h-6 animate-pulse" />
                    <CardTitle className="text-2xl font-bold text-center">Yêu Cầu Cứu Trợ</CardTitle>
                </div>
                <CardDescription className="text-red-100 text-center font-medium">
                    Hệ thống sẽ tự động định vị GPS của bạn
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2 text-gray-900 font-bold">
                            <User className="w-4 h-4" /> Họ và tên
                        </Label>
                        <Input
                            id="name"
                            placeholder="Nguyễn Văn A"
                            required
                            className="bg-white border-gray-400 text-gray-900 focus:ring-red-500 focus:border-red-500 transition-all font-medium"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2 text-gray-900 font-bold">
                            <Phone className="w-4 h-4" /> Số điện thoại
                        </Label>
                        <Input
                            id="phone"
                            placeholder="0912345678"
                            required
                            type="tel"
                            className="bg-white border-gray-400 text-gray-900 focus:ring-red-500 focus:border-red-500 transition-all font-medium"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address" className="flex items-center gap-2 text-gray-900 font-bold">
                            <MapPin className="w-4 h-4" /> Địa chỉ hiện tại
                        </Label>
                        <Input
                            id="address"
                            placeholder="Nhập địa chỉ hoặc để trống (tự động GPS)"
                            required
                            className="bg-white border-gray-400 text-gray-900 focus:ring-red-500 focus:border-red-500 transition-all font-medium"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-gray-900 font-bold">Mô tả sự cố</Label>
                        <Textarea
                            id="description"
                            placeholder="Mô tả chi tiết tình trạng, số người gặp nạn..."
                            required
                            className="bg-white border-gray-400 text-gray-900 focus:ring-red-500 focus:border-red-500 min-h-[100px] transition-all font-medium"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-gray-900 font-bold">
                            <FileVideo className="w-4 h-4" /> Hình ảnh/Video (Tùy chọn)
                        </Label>
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="images" className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-400 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <p className="mb-2 text-sm text-gray-700 font-medium"><span className="font-bold">Chạm để tải lên</span></p>
                                    <p className="text-xs text-gray-600">IMG, VIDEO (Max 3 file)</p>
                                </div>
                                <Input
                                    id="images"
                                    type="file"
                                    accept="image/*,video/*"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        {selectedFiles.length > 0 && (
                            <p className="text-sm text-green-700 font-bold text-center">
                                ✅ Đã chọn {selectedFiles.length} file
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6 text-lg shadow-lg transform transition-all active:scale-95"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang Gửi...
                            </>
                        ) : (
                            "GỬI YÊU CẦU KHẨN CẤP"
                        )}
                    </Button>
                </form>
            </CardContent>

            {/* Footer */}
            <div className="p-3 text-center text-xs text-gray-500 border-t border-gray-200 bg-gray-50">
                Powered by <span className="font-bold text-gray-700">TechData.AI</span>
            </div>
        </Card>
    );
}
