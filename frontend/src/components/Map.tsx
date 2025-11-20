"use client";
import * as React from 'react';
import Map, { Marker, NavigationControl, ViewStateChangeEvent } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "pk.eyJ1IjoiZGFjbG9jIiwiYSI6ImNsZzZ5Z2Z5ZzAwdjIzZXB5Z2Z5Z2Z5Z2Z5In0.Z2Z5Z2Z5Z2Z5Z2Z5Z2Z5Z2"; // Placeholder

interface RescueRequestMarker {
    id: string;
    latitude: number;
    longitude: number;
    description: string;
    status: string;
}

export default function MapComponent() {
    const [viewState, setViewState] = React.useState({
        longitude: 105.85, // Hanoi
        latitude: 21.02,
        zoom: 12
    });

    const [requests, setRequests] = React.useState<RescueRequestMarker[]>([]);

    React.useEffect(() => {
        // Fetch initial requests
        const fetchRequests = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/requests`);
                if (res.ok) {
                    const data = await res.json();
                    setRequests(data);
                }
            } catch (error) {
                console.error('Failed to fetch requests', error);
            }
        };

        fetchRequests();

        // Connect to WebSocket
        const socket = new WebSocket('ws://localhost:3000'); // TODO: Use socket.io-client properly

        socket.onopen = () => {
            console.log('Connected to WebSocket');
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.event === 'requestCreated') {
                // Add new marker
                console.log('New request created:', data.data);
                setRequests((prev) => [...prev, data.data]);
            }
        };

        return () => {
            socket.close();
        };
    }, []);

    return (
        <div className="w-full h-full">
            <Map
                {...viewState}
                onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={MAPBOX_TOKEN}
            >
                <NavigationControl position="top-right" />
                {requests.map((req) => (
                    <Marker
                        key={req.id}
                        longitude={req.longitude}
                        latitude={req.latitude}
                        color={req.status === 'PENDING' ? 'red' : 'green'}
                    />
                ))}
            </Map>
        </div>
    );
}
