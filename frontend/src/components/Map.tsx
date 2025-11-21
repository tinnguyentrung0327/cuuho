"use client";
import * as React from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre';
import type { ViewStateChangeEvent } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "pk.eyJ1IjoiZGFjbG9jIiwiYSI6ImNsZzZ5Z2Z5ZzAwdjIzZXB5Z2Z5Z2Z5Z2Z5In0.Z2Z5Z2Z5Z2Z5Z2Z5Z2Z5Z2"; // Placeholder

interface RescueRequestMarker {
    id: string;
    latitude: number;
    longitude: number;
    description: string;
    status: string;
}

interface Props {
    requests?: RescueRequestMarker[];
    center?: { latitude: number; longitude: number };
    zoom?: number;
    interactive?: boolean;
}

export default function MapComponent({ requests: propRequests, center, zoom, interactive = true }: Props) {
    const [viewState, setViewState] = React.useState({
        longitude: center?.longitude || 108.0, // Central Vietnam
        latitude: center?.latitude || 16.0,
        zoom: zoom || 5
    });

    const [internalRequests, setInternalRequests] = React.useState<RescueRequestMarker[]>([]);

    // Update viewState when center/zoom props change
    React.useEffect(() => {
        if (center) {
            setViewState(prev => ({
                ...prev,
                latitude: center.latitude,
                longitude: center.longitude,
                zoom: zoom || 14
            }));
        }
    }, [center, zoom]);

    React.useEffect(() => {
        // If requests are passed via props, don't fetch
        if (propRequests) return;

        // Fetch initial requests
        const fetchRequests = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/requests`, { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    setInternalRequests(data);
                }
            } catch (error) {
                console.error('Failed to fetch requests', error);
            }
        };

        fetchRequests();

        // Connect to WebSocket
        const socket = new WebSocket('ws://localhost:3000');

        socket.onopen = () => {
            console.log('Connected to WebSocket');
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.event === 'requestCreated') {
                // Add new marker
                console.log('New request created:', data.data);
                setInternalRequests((prev) => [...prev, data.data]);
            } else if (data.event === 'requestUpdated') {
                // Update existing marker
                console.log('Request updated:', data.data);
                setInternalRequests((prev) => prev.map(req => req.id === data.data.id ? data.data : req));
            }
        };

        return () => {
            socket.close();
        };
    }, [propRequests]);

    const displayRequests = propRequests || internalRequests;

    const getMarkerColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'red';
            case 'ASSIGNED': return 'blue';
            case 'ON_THE_WAY': return 'purple';
            case 'RESOLVED': return 'green';
            default: return 'gray';
        }
    };

    const ISLAND_LABELS = [
        { id: 'hoang-sa', name: 'QĐ Hoàng Sa', latitude: 16.333300, longitude: 111.666700 },
        { id: 'truong-sa', name: 'QĐ Trường Sa', latitude: 10.723300, longitude: 115.826500 }
    ];

    return (
        <div className="w-full h-full">
            <Map
                {...viewState}
                onMove={(evt: ViewStateChangeEvent) => interactive && setViewState(evt.viewState)}
                style={{ width: '100%', height: '100%' }}
                mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                scrollZoom={interactive}
                dragPan={interactive}
                doubleClickZoom={interactive}
            >
                <NavigationControl position="top-right" />

                {/* Rescue Request Markers */}
                {displayRequests.map((req) => (
                    <Marker
                        key={req.id}
                        longitude={req.longitude}
                        latitude={req.latitude}
                        color={getMarkerColor(req.status)}
                        anchor="bottom"
                    />
                ))}

                {/* Island Labels */}
                {ISLAND_LABELS.map((island) => (
                    <Marker
                        key={island.id}
                        longitude={island.longitude}
                        latitude={island.latitude}
                        anchor="top"
                    >
                        <div className="flex flex-col items-center pointer-events-none mt-2">
                            <span className="text-xs font-bold text-blue-900 bg-white/90 px-2 py-1 rounded shadow-sm border border-blue-100 whitespace-nowrap">
                                🇻🇳 {island.name}
                            </span>
                        </div>
                    </Marker>
                ))}
            </Map>
        </div>
    );
}
