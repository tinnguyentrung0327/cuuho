# Emergency Rescue Platform

Platform cứu hộ khẩn cấp với bản đồ realtime và WebSocket.

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Shadcn UI
- Mapbox GL JS
- Zustand
- React Query

### Backend
- NestJS
- TypeScript
- PostgreSQL (Railway)
- Prisma ORM
- WebSocket (Socket.io)

## Quick Start

### Backend
```bash
cd backend
npm install
npx prisma generate
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Deploy

Xem hướng dẫn chi tiết trong `DEPLOY.md`

## Environment Variables

### Backend (.env)
```
DATABASE_URL="postgresql://..."
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```
