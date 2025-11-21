"use client";
import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import MapComponent from '@/components/Map';
import { Home, Search, RefreshCw, Trash2, MapPin, Phone, User, Clock, AlertCircle } from 'lucide-react';

interface Attachment {
    id: string;
    url: string;
    type: string;
}

interface Requester {
    id: string;
    name: string | null;
    phone: string | null;
    email: string;
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
    attachments?: Attachment[];
    requester?: Requester;
}

export default function Dashboard() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
    const [filterAddress, setFilterAddress] = useState('');
    const [filterPhone, setFilterPhone] = useState('');

    const fetchRequests = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (filterAddress) params.append('address', filterAddress);
            if (filterPhone) params.append('phone', filterPhone);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/requests?${params.toString()}`, { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                setRequests(data);
            }
        } catch (error) {
            console.error("Failed to fetch requests", error);
        }
    }, [filterAddress, filterPhone]);

    useEffect(() => {
        fetchRequests();
        const interval = setInterval(fetchRequests, 5000);
        return () => clearInterval(interval);
    }, [fetchRequests]);

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // Prevent selecting the card

        const code = prompt('Nhập mã bảo mật để xoá yêu cầu:');
        if (code === null) return; // User cancelled

        if (code !== 'CTKC911') {
            alert('Bạn ko có quyền xoá!');
            return;
        }

        if (!confirm('Bạn có chắc chắn muốn xoá yêu cầu này?')) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/requests/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setRequests(prev => prev.filter(r => r.id !== id));
                if (selectedRequest?.id === id) {
                    setSelectedRequest(null);
                }
                alert('Đã xoá thành công');
            } else {
                alert('Xoá thất bại');
            }
        } catch (error) {
            console.error('Failed to delete', error);
            alert('Có lỗi xảy ra');
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/requests/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                const updatedRequest = await res.json();
                setRequests(prev => prev.map(r => r.id === id ? updatedRequest : r));
                if (selectedRequest?.id === id) {
                    setSelectedRequest(updatedRequest);
                }
            } else {
                alert('Cập nhật trạng thái thất bại');
            }
        } catch (error) {
            console.error('Failed to update status', error);
            alert('Có lỗi xảy ra');
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-50 overflow-hidden">
            {/* LEFT PANEL (Mobile: Top part, Desktop: Left 1/3) */}
            <div className="flex flex-col w-full md:w-1/3 h-full bg-white border-r border-gray-200 z-10 shadow-sm md:shadow-none">
                {/* Header */}
                <div className="p-4 flex justify-between items-center border-b border-gray-100">
                    <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <AlertCircle className="text-red-600" />
                        Dashboard Cứu Hộ
                    </h1>
                    <Link href="/">
                        <Button size="sm" className="bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300">
                            <Home className="w-4 h-4 mr-1" /> Trang Chủ
                        </Button>
                    </Link>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-0 border-b border-gray-100 divide-x divide-gray-100 bg-gray-50">
                    <div className="p-3 text-center">
                        <div className="text-xl font-bold text-blue-600">{requests.length}</div>
                        <div className="text-xs text-gray-500 font-medium uppercase">Tổng</div>
                    </div>
                    <div className="p-3 text-center">
                        <div className="text-xl font-bold text-yellow-600">
                            {requests.filter(r => r.status === 'PENDING').length}
                        </div>
                        <div className="text-xs text-gray-500 font-medium uppercase">Chờ xử lý</div>
                    </div>
                    <div className="p-3 text-center">
                        <div className="text-xl font-bold text-green-600">
                            {requests.filter(r => r.status === 'RESOLVED').length}
                        </div>
                        <div className="text-xs text-gray-500 font-medium uppercase">Hoàn thành</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="p-2 bg-white border-b border-gray-100 flex gap-2 overflow-x-auto">
                    <div className="relative flex-1 min-w-[150px]">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm địa chỉ..."
                            className="w-full pl-8 pr-3 py-2 border rounded-md text-sm bg-gray-50 focus:bg-white transition-colors"
                            value={filterAddress}
                            onChange={(e) => setFilterAddress(e.target.value)}
                        />
                    </div>
                    <div className="relative flex-1 min-w-[120px]">
                        <Phone className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm SĐT..."
                            className="w-full pl-8 pr-3 py-2 border rounded-md text-sm bg-gray-50 focus:bg-white transition-colors"
                            value={filterPhone}
                            onChange={(e) => setFilterPhone(e.target.value)}
                        />
                    </div>
                    <Button onClick={fetchRequests} size="icon" variant="outline" className="shrink-0">
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </div>

                {/* Request List (Scrollable) */}
                <div className="flex-1 overflow-y-auto bg-gray-100 p-2 md:p-4 space-y-3 min-h-0">
                    {requests.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-lg">Chưa có yêu cầu nào</p>
                        </div>
                    ) : (
                        requests.map((req) => (
                            <Card
                                key={req.id}
                                className={`border-l-4 shadow-sm active:scale-[0.99] transition-transform cursor-pointer ${selectedRequest?.id === req.id ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-300' :
                                        req.status === 'PENDING' ? 'border-l-red-500' :
                                            req.status === 'RESOLVED' ? 'border-l-green-500' : 'border-l-blue-500'
                                    }`}
                                onClick={() => setSelectedRequest(req)}
                            >
                                <CardContent className="p-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${req.priority === 'CRITICAL' ? 'bg-red-600 text-white' :
                                                    req.priority === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {req.priority}
                                            </span>
                                            <span className="font-bold text-gray-800 text-sm flex items-center gap-1">
                                                <User className="w-3 h-3" /> {req.requester?.name || 'Ẩn danh'}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-800 font-medium line-clamp-2 mb-2">{req.description}</p>

                                    <div className="flex items-start gap-1 text-xs text-gray-600 mb-3">
                                        <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                                        <span className="line-clamp-1">{req.address || 'Chưa có địa chỉ'}</span>
                                    </div>

                                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                req.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-800' :
                                                    req.status === 'ON_THE_WAY' ? 'bg-purple-100 text-purple-800' :
                                                        'bg-green-100 text-green-800'
                                            }`}>
                                            {req.status === 'PENDING' ? 'ĐANG CHỜ' :
                                                req.status === 'ASSIGNED' ? 'ĐÃ TIẾP NHẬN' :
                                                    req.status === 'ON_THE_WAY' ? 'ĐANG ĐẾN' : 'HOÀN THÀNH'}
                                        </span>

                                        <button
                                            onClick={(e) => handleDelete(e, req.id)}
                                            className="text-gray-400 hover:text-red-600 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT PANEL (Mobile: Bottom Fixed 40vh, Desktop: Right 2/3 Full Height) */}
            <div className="w-full md:w-2/3 h-[40vh] md:h-full relative bg-white border-t md:border-t-0 md:border-l border-gray-200 flex-none md:flex-auto">
                {selectedRequest ? (
                    <div className="absolute inset-0 flex flex-row md:flex-col h-full">
                        {/* Header for Mobile Detail (Hidden on Desktop usually, or kept) */}
                        <div className="absolute top-0 left-0 right-0 bg-white/90 backdrop-blur z-10 px-4 py-2 border-b border-gray-200 flex justify-between items-center md:hidden">
                            <h3 className="font-bold text-sm">Chi tiết yêu cầu</h3>
                            <Button size="sm" variant="ghost" onClick={() => setSelectedRequest(null)} className="h-8 text-xs">
                                Đóng
                            </Button>
                        </div>

                        {/* Map Half */}
                        <div className="w-1/2 md:w-full h-full md:h-1/2 relative border-r md:border-r-0 md:border-b border-gray-200 pt-10 md:pt-0">
                            <MapComponent
                                requests={[selectedRequest]}
                                center={{ latitude: selectedRequest.latitude, longitude: selectedRequest.longitude }}
                                zoom={15}
                                interactive={false}
                            />
                            <Button
                                className="hidden md:flex absolute top-4 left-4 bg-white text-black hover:bg-gray-100 shadow-md z-10"
                                onClick={() => setSelectedRequest(null)}
                            >
                                ← Quay lại bản đồ tổng
                            </Button>
                        </div>

                        {/* Info Half */}
                        <div className="w-1/2 md:w-full h-full md:h-1/2 p-3 md:p-6 overflow-y-auto bg-white pt-10 md:pt-6">
                            {/* Desktop Title (Hidden on Mobile) */}
                            <div className="hidden md:block mb-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2">Chi tiết yêu cầu cứu hộ</h2>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <span className="font-medium">Mã theo dõi:</span>
                                            <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                                {selectedRequest.id.substring(0, 8).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`px-4 py-2 rounded-full text-sm font-bold ${selectedRequest.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                            selectedRequest.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-800' :
                                                selectedRequest.status === 'ON_THE_WAY' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-green-100 text-green-800'
                                        }`}>
                                        {selectedRequest.status}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-2 md:space-y-0 md:mb-6 md:p-4 md:bg-gray-50 md:rounded-lg md:border md:border-gray-200">
                                <h3 className="hidden md:block text-sm font-bold mb-3 text-gray-700">Cập nhật trạng thái</h3>
                                <div className="grid grid-cols-1 md:flex md:flex-wrap gap-2">
                                    <Button
                                        size="sm"
                                        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-xs md:text-sm"
                                        onClick={() => handleStatusUpdate(selectedRequest.id, 'ASSIGNED')}
                                    >
                                        Tiếp nhận
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-xs md:text-sm"
                                        onClick={() => handleStatusUpdate(selectedRequest.id, 'ON_THE_WAY')}
                                    >
                                        Đang đến
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-xs md:text-sm"
                                        onClick={() => handleStatusUpdate(selectedRequest.id, 'RESOLVED')}
                                    >
                                        Hoàn thành
                                    </Button>
                                </div>
                            </div>

                            {/* Info Details */}
                            <div className="mt-2 md:mt-0 space-y-2 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
                                <div className="space-y-1 md:space-y-4">
                                    <div>
                                        <h3 className="text-xs md:text-sm font-semibold text-gray-500 uppercase">Người yêu cầu</h3>
                                        <p className="text-sm md:text-lg font-medium">{selectedRequest.requester?.name || 'Không có tên'}</p>
                                        <p className="text-xs md:text-base text-blue-600 font-bold">
                                            <a href={`tel:${selectedRequest.requester?.phone}`}>{selectedRequest.requester?.phone}</a>
                                        </p>
                                    </div>
                                    <div className="hidden md:block">
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase">Vị trí</h3>
                                        <p className="text-gray-800">{selectedRequest.address || 'Chưa có địa chỉ cụ thể'}</p>
                                    </div>
                                </div>
                                <div className="space-y-1 md:space-y-4">
                                    <div>
                                        <h3 className="text-xs md:text-sm font-semibold text-gray-500 uppercase">Mô tả</h3>
                                        <p className="text-sm md:text-base text-gray-800 md:bg-gray-50 md:p-4 md:rounded-lg md:border md:border-gray-100">
                                            {selectedRequest.description}
                                        </p>
                                    </div>
                                    {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
                                        <div className="hidden md:block">
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Hình ảnh</h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                {selectedRequest.attachments.map((attachment) => (
                                                    <div key={attachment.id} className="relative h-24 rounded overflow-hidden bg-gray-100 border">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={attachment.url} alt="Att" className="w-full h-full object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <MapComponent requests={requests} />
                        {/* Map Legend */}
                        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200 z-10 hidden md:block">
                            <h3 className="text-sm font-bold mb-2">Chú thích</h3>
                            <div className="space-y-1 text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <span>Đang chờ xử lý</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    <span>Đã phân công</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span>Hoàn thành</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
