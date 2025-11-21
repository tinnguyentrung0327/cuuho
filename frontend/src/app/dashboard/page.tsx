"use client";
import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import MapComponent from '@/components/Map';

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
        <div className="flex h-screen bg-gray-50">
            {/* Left Panel - Request List (1/3) */}
            <div className="w-1/3 flex flex-col border-r border-gray-200 bg-white">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Dashboard Cứu Hộ</h1>
                        <Link href="/">
                            <Button className="bg-green-600 hover:bg-green-700 text-sm">
                                🏠 Trang Chủ
                            </Button>
                        </Link>
                    </div>

                    {/* Filters */}
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Tìm theo khu vực/địa chỉ..."
                            className="w-full px-3 py-2 border rounded text-sm"
                            value={filterAddress}
                            onChange={(e) => setFilterAddress(e.target.value)}
                        />
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Tìm theo SĐT..."
                                className="flex-1 px-3 py-2 border rounded text-sm"
                                value={filterPhone}
                                onChange={(e) => setFilterPhone(e.target.value)}
                            />
                            <Button onClick={fetchRequests} size="sm" variant="outline">
                                🔍
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="p-4 bg-blue-50 border-b border-gray-200">
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                            <div className="text-2xl font-bold text-blue-600">{requests.length}</div>
                            <div className="text-xs text-gray-600">Tổng</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-yellow-600">
                                {requests.filter(r => r.status === 'PENDING').length}
                            </div>
                            <div className="text-xs text-gray-600">Chờ xử lý</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-green-600">
                                {requests.filter(r => r.status === 'RESOLVED').length}
                            </div>
                            <div className="text-xs text-gray-600">Hoàn thành</div>
                        </div>
                    </div>
                </div>

                {/* Request List - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {requests.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-lg">Chưa có yêu cầu</p>
                            <p className="text-sm mt-2">Các yêu cầu sẽ hiển thị ở đây</p>
                        </div>
                    ) : (
                        requests.map((req) => (
                            <Card
                                key={req.id}
                                className={`border-l-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative group ${selectedRequest?.id === req.id ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200' : 'border-l-red-500'
                                    }`}
                                onClick={() => setSelectedRequest(req)}
                            >
                                <CardHeader className="p-3 pb-2">
                                    <CardTitle className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold bg-red-100 text-red-800 px-2 py-1 rounded">
                                                {req.priority}
                                            </span>
                                            <span className="font-bold text-gray-800">
                                                {req.requester?.name || 'Người dân'}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {new Date(req.createdAt).toLocaleTimeString()}
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-3 pt-0 space-y-2">
                                    <p className="text-sm text-gray-700 line-clamp-2">{req.description}</p>

                                    {req.address && (
                                        <div className="flex items-start gap-1 text-xs">
                                            <span className="text-gray-500">📍</span>
                                            <span className="text-gray-600 line-clamp-1">{req.address}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center mt-2">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                            req.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-800' :
                                                req.status === 'ON_THE_WAY' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-green-100 text-green-800'
                                            }`}>
                                            {req.status}
                                        </span>

                                        {/* Delete Button */}
                                        <button
                                            onClick={(e) => handleDelete(e, req.id)}
                                            className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                                            title="Xoá yêu cầu"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* Right Panel - Map or Detail View (2/3) */}
            <div className="w-2/3 relative h-full flex flex-col">
                {selectedRequest ? (
                    // Detail View
                    <div className="flex flex-col h-full">
                        {/* Top Half: Map focused on request */}
                        <div className="h-1/2 relative border-b border-gray-200">
                            <MapComponent
                                requests={[selectedRequest]}
                                center={{ latitude: selectedRequest.latitude, longitude: selectedRequest.longitude }}
                                zoom={15}
                                interactive={false}
                            />
                            <Button
                                className="absolute top-4 left-4 bg-white text-black hover:bg-gray-100 shadow-md z-10"
                                onClick={() => setSelectedRequest(null)}
                            >
                                ← Quay lại bản đồ tổng
                            </Button>
                        </div>

                        {/* Bottom Half: Detailed Info */}
                        <div className="h-1/2 bg-white p-6 overflow-y-auto">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">Chi tiết yêu cầu cứu hộ</h2>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <span className="font-medium">Mã theo dõi:</span>
                                        <a
                                            href={`/tracking/${selectedRequest.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded hover:bg-blue-100 hover:underline transition-colors"
                                            title="Mở trang theo dõi trong tab mới"
                                        >
                                            {selectedRequest.id.substring(0, 8).toUpperCase()} ↗
                                        </a>
                                    </div>
                                </div>
                                <div className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${selectedRequest.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                    selectedRequest.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-800' :
                                        selectedRequest.status === 'ON_THE_WAY' ? 'bg-purple-100 text-purple-800' :
                                            'bg-green-100 text-green-800'
                                    }`}>
                                    {selectedRequest.status}
                                </div>
                            </div>

                            {/* Status Update Controls */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <h3 className="text-sm font-bold mb-3 text-gray-700">Cập nhật trạng thái (Admin/Rescuer)</h3>
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        size="sm"
                                        variant={selectedRequest.status === 'PENDING' ? 'default' : 'outline'}
                                        className={selectedRequest.status === 'PENDING' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                                        onClick={() => handleStatusUpdate(selectedRequest.id, 'PENDING')}
                                    >
                                        Chờ xử lý
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={selectedRequest.status === 'ASSIGNED' ? 'default' : 'outline'}
                                        className={selectedRequest.status === 'ASSIGNED' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                                        onClick={() => handleStatusUpdate(selectedRequest.id, 'ASSIGNED')}
                                    >
                                        Đã tiếp nhận
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={selectedRequest.status === 'ON_THE_WAY' ? 'default' : 'outline'}
                                        className={selectedRequest.status === 'ON_THE_WAY' ? 'bg-purple-500 hover:bg-purple-600' : ''}
                                        onClick={() => handleStatusUpdate(selectedRequest.id, 'ON_THE_WAY')}
                                    >
                                        Đang đến
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={selectedRequest.status === 'RESOLVED' ? 'default' : 'outline'}
                                        className={selectedRequest.status === 'RESOLVED' ? 'bg-green-500 hover:bg-green-600' : ''}
                                        onClick={() => handleStatusUpdate(selectedRequest.id, 'RESOLVED')}
                                    >
                                        Hoàn thành
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Người yêu cầu</h3>
                                        <p className="text-lg font-medium">{selectedRequest.requester?.name || 'Không có tên'}</p>
                                        <p className="text-gray-600">{selectedRequest.requester?.phone || 'Không có SĐT'}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Vị trí</h3>
                                        <p className="text-gray-800">{selectedRequest.address || 'Chưa có địa chỉ cụ thể'}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            GPS: {selectedRequest.latitude.toFixed(6)}, {selectedRequest.longitude.toFixed(6)}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Thời gian</h3>
                                        <p className="text-gray-800">{new Date(selectedRequest.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Mô tả sự cố</h3>
                                        <p className="text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                            {selectedRequest.description}
                                        </p>
                                    </div>

                                    {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Hình ảnh / Video</h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                {selectedRequest.attachments.map((attachment) => (
                                                    <div key={attachment.id} className="relative h-32 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group">
                                                        {attachment.type === 'IMAGE' ? (
                                                            <a href={attachment.url} target="_blank" rel="noopener noreferrer">
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
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Global Map View
                    <>
                        <MapComponent />

                        {/* Map Legend */}
                        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200 z-10">
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

            {/* Footer */}
            <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center pointer-events-none">
                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-gray-200 pointer-events-auto">
                    <p className="text-sm text-gray-700 font-medium">
                        Powered by{' '}
                        <a
                            href="https://techdata.ai"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors"
                        >
                            TechData.AI
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
