# Deployment Instructions

## Prerequisites
- GitHub Account
- Vercel Account (for Frontend)
- Render or Railway Account (for Backend & Database)

## 1. Database (PostgreSQL)
1. Create a new PostgreSQL project on Railway or Render.
2. Get the `DATABASE_URL` connection string.
   - Format: `postgresql://user:password@host:port/database`

## 2. Backend (NestJS)
1. Push the `backend` folder to a GitHub repository (or the whole monorepo).
2. On Render/Railway, create a new Web Service.
3. Connect your GitHub repo.
4. Set Root Directory to `backend`.
5. Add Environment Variable:
   - `DATABASE_URL`: (Paste your connection string)
6. Deploy.
7. Copy the Backend URL (e.g., `https://cuuho-backend.onrender.com`).

## 3. Frontend (Next.js)
1. Push the `frontend` folder to GitHub.
2. On Vercel, create a new Project.
3. Connect your GitHub repo.
4. Set Root Directory to `frontend`.
5. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL`: (Your Backend URL)
   - `NEXT_PUBLIC_MAPBOX_TOKEN`: (Your Mapbox Token)
6. Deploy.

## 4. Verification
- Open the Vercel URL.
- Try sending a request.
- Check if it appears in the Backend database.
