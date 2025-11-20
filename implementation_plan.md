# Emergency Rescue Platform - Implementation Plan

## Phase 1: Project Setup & Initialization
- [x] Create project structure (frontend, backend, docs, infra)
- [x] Initialize Next.js Frontend (TypeScript, Tailwind, App Router)
- [x] Initialize NestJS Backend (TypeScript)
- [ ] Setup Monorepo workspace (optional, or just separate folders)

## Phase 2: Backend Core (NestJS + Prisma + Postgres)
- [x] Setup Prisma with PostgreSQL (Connected to Railway)
- [x] Define Database Schema (User, RescueRequest, RescueTeam, EmergencyAlert, LocationLog, FileAttachment)
- [x] Setup Auth Module (JWT)
- [x] Setup Gateway Module (WebSocket)
- [x] Implement Rescue Request CRUD
- [x] Implement Realtime Location Updates

## Phase 3: Frontend Core (Next.js + Shadcn + Mapbox)
- [x] Setup Shadcn UI
- [x] Setup Zustand & React Query
- [x] Implement Mapbox Component
- [x] Create "Send Request" Page
- [x] Create "Dashboard" for Rescuers
- [x] Implement Realtime Updates (WebSocket Client)

## Phase 4: Deployment
- [x] Configure Environment Variables
- [x] Deploy Backend to Render/Railway
- [x] Deploy Frontend to Vercel
