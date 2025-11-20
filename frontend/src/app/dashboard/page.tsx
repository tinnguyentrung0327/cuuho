"use client";
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Request {
    id: string;
    description: string;
    status: string;
    priority: string;
    createdAt: string;
}

export default function Dashboard() {
    const [requests, setRequests] = useState<Request[]>([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/requests`);
                if (res.ok) {
                    const data = await res.json();
                    setRequests(data);
                }
            } catch (error) {
                console.error("Failed to fetch requests", error);
            }
        };

        fetchRequests();
        const interval = setInterval(fetchRequests, 5000); // Polling for now
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Dashboard Cứu Hộ</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {requests.map((req) => (
                    <Card key={req.id} className="border-l-4 border-l-red-500 shadow-md">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>{req.priority} PRIORITY</span>
                                <span className="text-sm text-gray-500">{new Date(req.createdAt).toLocaleTimeString()}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-2">{req.description}</p>
                            <div className="flex justify-between items-center mt-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                    {req.status}
                                </span>
                                <button className="text-blue-600 hover:underline text-sm">Chi tiết</button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
