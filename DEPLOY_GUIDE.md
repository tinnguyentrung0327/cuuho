# 🚀 Hướng dẫn Deploy Emergency Rescue Platform

## Bước 1: Push code lên GitHub

```bash
# Tạo repo mới trên GitHub (https://github.com/new)
# Đặt tên: cuuho-emergency-rescue

# Push code
git remote add origin https://github.com/YOUR_USERNAME/cuuho-emergency-rescue.git
git branch -M main
git push -u origin main
```

## Bước 2: Deploy Backend lên Railway

### 2.1. Truy cập Railway
1. Vào https://railway.app
2. Đăng nhập bằng GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Chọn repo `cuuho-emergency-rescue`

### 2.2. Cấu hình Backend Service
1. Railway sẽ tự động phát hiện NestJS
2. Vào **Settings** → **Root Directory** → Nhập: `backend`
3. Vào **Variables** → Add:
   ```
   DATABASE_URL=postgresql://postgres:PaxpUQXUNEJWFSdAYFuIlRtGCtKzmWfz@maglev.proxy.rlwy.net:25980/railway
   NODE_ENV=production
   PORT=3000
   ```

### 2.3. Deploy
1. Click **"Deploy"**
2. Đợi build xong (khoảng 2-3 phút)
3. Copy **Public URL** (ví dụ: `https://cuuho-backend.up.railway.app`)

### 2.4. Chạy Migration (quan trọng!)
1. Vào **Settings** → **Railway CLI**
2. Hoặc run locally:
   ```bash
   # Cài Railway CLI
   npm i -g @railway/cli
   
   # Login
   railway login
   
   # Link project
   railway link
   
   # Run migration
   railway run npx prisma migrate deploy
   ```

## Bước 3: Deploy Frontend lên Vercel

### 3.1. Truy cập Vercel
1. Vào https://vercel.com
2. Đăng nhập bằng GitHub
3. Click **"Add New..."** → **"Project"**
4. Import repo `cuuho-emergency-rescue`

### 3.2. Cấu hình
1. **Framework Preset**: Next.js (tự động phát hiện)
2. **Root Directory**: `frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `.next`

### 3.3. Environment Variables
Click **"Environment Variables"** → Add:

```
NEXT_PUBLIC_API_URL=https://cuuho-backend.up.railway.app
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1... (token Mapbox của bạn)
```

**Lấy Mapbox Token**:
1. Vào https://www.mapbox.com
2. Đăng ký free account
3. Copy **Access Token** từ dashboard

### 3.4. Deploy
1. Click **"Deploy"**
2. Đợi build (1-2 phút)
3. Vercel sẽ cung cấp URL (ví dụ: `https://cuuho-emergency.vercel.app`)

## Bước 4: Cập nhật CORS (Backend)

Sau khi có URL Vercel, cập nhật file `backend/src/main.ts`:

```typescript
app.enableCors({
  origin: [
    'https://cuuho-emergency.vercel.app', // Thay bằng URL thật
    'http://localhost:3001'
  ]
});
```

Commit và push lại:
```bash
git add .
git commit -m "Update CORS with production URL"
git push
```

Railway sẽ tự động redeploy.

## Bước 5: Kiểm tra

1. Truy cập Frontend URL: `https://cuuho-emergency.vercel.app`
2. Gửi thử 1 yêu cầu cứu hộ
3. Kiểm tra Dashboard: `https://cuuho-emergency.vercel.app/dashboard`
4. Xem logs trên Railway/Vercel nếu có lỗi

## 🎉 Hoàn tất!

Website của bạn đã live và có thể truy cập từ bất kỳ đâu!

### URLs tham khảo:
- Frontend: `https://cuuho-emergency.vercel.app`
- Backend API: `https://cuuho-backend.up.railway.app`
- Database: Railway PostgreSQL (đã có)

## Troubleshooting

### Lỗi "Cannot connect to database"
- Kiểm tra `DATABASE_URL` trong Railway Variables
- Chắc chắn đã chạy `prisma migrate deploy`

### Lỗi CORS
- Kiểm tra đã update `enableCors()` với đúng URL Vercel
- Clear cache và thử lại

### WebSocket không hoạt động
- Railway/Render hỗ trợ WebSocket
- Đảm bảo Frontend connect tới đúng Backend URL (ws://)

## Nâng cấp sau này

- **Custom Domain**: Mua domain và add vào Vercel
- **SSL Certificate**: Vercel tự động cung cấp HTTPS
- **Monitoring**: Add Sentry hoặc LogRocket
- **CDN**: Vercel tự động optimize
