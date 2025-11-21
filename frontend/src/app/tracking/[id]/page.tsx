"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import MapComponent from '@/components/Map';
import Link from 'next/link';

interface Attachment {
    id: string;
    url: string;
    type: string;
}

interface Request {
    id: string;
    description: string;
    address?: string;
    status: string;
    priority: string;
    createdAt: string;
    latitude: number;
    longitude: number;
    rating?: number;
    feedback?: string;
    attachments?: Attachment[];
}

export default function TrackingPage() {
    const params = useParams();
    const id = params.id as string;
    const [request, setRequest] = useState<Request | null>(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/requests/${id}`, { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    setRequest(data);
                    if (data.rating) setRating(data.rating);
                    if (data.feedback) setFeedback(data.feedback);
                }
            } catch (error) {
                console.error("Failed to fetch request", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequest();
        const interval = setInterval(fetchRequest, 5000); // Poll for updates
        return () => clearInterval(interval);
    }, [id]);

    const handleSubmitFeedback = async () => {
        if (!rating) {
            alert('Vui lòng chọn số sao đánh giá');
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/requests/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rating,
                    feedback,
                }),
            });

            if (res.ok) {
                alert('Cảm ơn đánh giá của bạn!');
                // Refresh data
                const updated = await res.json();
                setRequest(updated);
            } else {
                alert('Gửi đánh giá thất bại');
            }
        } catch (error) {
            console.error('Error submitting feedback', error);
            alert('Có lỗi xảy ra');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Đang tải...</div>;
    if (!request) return <div className="flex justify-center items-center h-screen">Không tìm thấy yêu cầu</div>;

    const steps = [
        { status: 'PENDING', label: 'Đã gửi', icon: '📩' },
        { status: 'ASSIGNED', label: 'Đã tiếp nhận', icon: '👮' },
        { status: 'ON_THE_WAY', label: 'Đang đến', icon: '🚑' },
        { status: 'RESOLVED', label: 'Hoàn thành', icon: '✅' },
    ];

    const currentStepIndex = steps.findIndex(s => s.status === request.status);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Theo dõi yêu cầu cứu trợ</h1>
                    <Link href="/">
                        <Button variant="outline">🏠 Về Trang Chủ</Button>
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Column: Status & Info */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Trạng thái xử lý</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                                    {steps.map((step, index) => {
                                        const isCompleted = index <= currentStepIndex;
                                        const isCurrent = index === currentStepIndex;

                                        return (
                                            <div key={step.status} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-gray-300'
                                                    }`}>
                                                    {isCompleted ? step.icon : index + 1}
                                                </div>
                                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 shadow bg-white">
                                                    <div className={`font-bold ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>{step.label}</div>
                                                    {isCurrent && <div className="text-xs text-blue-600 font-medium animate-pulse">Đang xử lý...</div>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin yêu cầu</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p><span className="font-semibold">Mã theo dõi:</span> {request.id.substring(0, 8).toUpperCase()}</p>
                                <p><span className="font-semibold">Mô tả:</span> {request.description}</p>
                                {request.address && <p><span className="font-semibold">Địa chỉ:</span> {request.address}</p>}
                                <p><span className="font-semibold">Thời gian gửi:</span> {new Date(request.createdAt).toLocaleString()}</p>

                                {request.attachments && request.attachments.length > 0 && (
                                    <div className="mt-4">
                                        <p className="font-semibold mb-2">Hình ảnh/Video đính kèm:</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {request.attachments.map((attachment) => (
                                                <div key={attachment.id} className="relative h-32 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group">
                                                    {attachment.type === 'IMAGE' ? (
                                                        <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img
                                                                src={attachment.url}
                                                                alt="Attachment"
                                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                            />
                                                        </a>
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-gray-500">
                                                            <span className="text-2xl">📹</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {request.status === 'RESOLVED' && (
                            <Card className="border-green-200 bg-green-50">
                                <CardHeader>
                                    <CardTitle className="text-green-800">Đánh giá dịch vụ</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-2 justify-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => !request.rating && setRating(star)}
                                                disabled={!!request.rating}
                                                className={`text-3xl transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
                                                    }`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>

                                    {!request.rating ? (
                                        <>
                                            <div className="space-y-2">
                                                <Label>Phản hồi của bạn (tùy chọn)</Label>
                                                <Textarea
                                                    placeholder="Nhập phản hồi..."
                                                    value={feedback}
                                                    onChange={(e) => setFeedback(e.target.value)}
                                                />
                                            </div>
                                            <Button
                                                className="w-full bg-green-600 hover:bg-green-700"
                                                onClick={handleSubmitFeedback}
                                                disabled={submitting}
                                            >
                                                {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="text-center text-green-700 font-medium">
                                            Cảm ơn bạn đã đánh giá!
                                            {request.feedback && <p className="text-sm text-gray-600 mt-2 italic">&quot;{request.feedback}&quot;</p>}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column: Map */}
                    <div className="h-[400px] md:h-auto min-h-[400px] rounded-xl overflow-hidden border border-gray-200 shadow-lg relative">
                        <MapComponent
                            requests={[request]}
                            center={{ latitude: request.latitude, longitude: request.longitude }}
                            zoom={15}
                            interactive={true}
                        />
                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-2 rounded shadow text-xs">
                            📍 Vị trí của bạn
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
