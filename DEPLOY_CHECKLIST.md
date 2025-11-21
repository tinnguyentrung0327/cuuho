# 🚀 DEPLOY CHECKLIST - LÀMTHEO THỨ TỰ

## ✅ ĐÃ XONG
- [x] Code đã commit
- [x] Tạo .gitignore
- [x] Tạo README.md
- [x] Tạo hướng dẫn deploy

## 📌 BẠN CẦN LÀM (5 BƯỚC)

### BƯỚC 1: TẠO GITHUB REPOSITORY (2 phút)

1. Mở trình duyệt, vào: https://github.com/new
2. Điền thông tin:
   - **Repository name**: `cuuho-emergency-rescue`
   - **Description**: "Emergency Rescue Platform với bản đồ realtime"
   - **Public** (hoặc Private nếu muốn)
   - ❌ KHÔNG tick "Add README", "Add .gitignore"
3. Click **"Create repository"**

4. Copy 2 lệnh này và chạy trong terminal (thay YOUR_USERNAME):

```bash
cd /Users/dacloc/github/cuuho
git remote add origin https://github.com/YOUR_USERNAME/cuuho-emergency-rescue.git
git push -u origin main
```

**✅ Kiểm tra**: Refresh GitHub, thấy code đã được push lên


---


### BƯỚC 2: DEPLOY BACKEND LÊN RAILWAY (5 phút)

1. Vào: https://railway.app
2. Click **"Login with GitHub"**
3. Click **"New Project"**
4. Chọn **"Deploy from GitHub repo"**
5. Search và chọn repo: `cuuho-emergency-rescue`

**Cấu hình:**
6. Sau khi import, click vào service vừa tạo
7. Vào **Settings** tab:
   - **Root Directory**: Nhập `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`

8. Vào **Variables** tab, click **"+ New Variable"**, thêm:

```
DATABASE_URL=postgresql://postgres:PaxpUQXUNEJWFSdAYFuIlRtGCtKzmWfz@maglev.proxy.rlwy.net:25980/railway
NODE_ENV=production
PORT=3000
```

9. Click **"Deploy"** (hoặc Railway tự deploy)

10. **QUAN TRỌNG**: Sau khi deploy xong, vào **Settings** → Copy **Public Domain**
    Ví dụ: `https://cuuho-backend-production.up.railway.app`

**✅ Kiểm tra**: Truy cập `https://cuuho-backend-production.up.railway.app` → thấy "Hello World" hoặc response


---


### BƯỚC 3: LẤY MAPBOX TOKEN (2 phút)

1. Vào: https://account.mapbox.com/auth/signup/
2. Đăng ký account (miễn phí)
3. Sau khi đăng ký, vào **Access tokens**
4. Copy **Default public token** (bắt đầu bằng `pk.eyJ...`)

Lưu token này lại để dùng ở bước 4.


---


### BƯỚC 4: DEPLOY FRONTEND LÊN VERCEL (5 phút)

1. Vào: https://vercel.com/signup
2. Click **"Continue with GitHub"**
3. Click **"Add New..."** → **"Project"**
4. Search và chọn repo: `cuuho-emergency-rescue`
5. Click **"Import"**

**Cấu hình:**
6. **Framework Preset**: Next.js (tự động)
7. **Root Directory**: Click **"Edit"** → Nhập `frontend`
8. Expand **"Environment Variables"**:

Thêm 2 biến:

**Biến 1:**
- Name: `NEXT_PUBLIC_API_URL`
- Value: `https://cuuho-backend-production.up.railway.app` (URL Railway từ Bước 2)

**Biến 2:**
- Name: `NEXT_PUBLIC_MAPBOX_TOKEN`
- Value: `pk.eyJ...` (Token Mapbox từ Bước 3)

9. Click **"Deploy"**

10. Đợi 1-2 phút, Vercel sẽ cho URL như:
    `https://cuuho-emergency-rescue.vercel.app`

**✅ Kiểm tra**: Mở URL Vercel → Thấy website hiển thị bản đồ


---


### BƯỚC 5: CẬP NHẬT CORS (2 phút)

Mở file `/Users/dacloc/github/cuuho/backend/src/main.ts`

Sửa dòng `app.enableCors();` thành:

```typescript
app.enableCors({
  origin: [
    'https://cuuho-emergency-rescue.vercel.app',  // ← Thay bằng URL Vercel thật của bạn
    'http://localhost:3001'
  ]
});
```

Sau đó commit và push:

```bash
cd /Users/dacloc/github/cuuho
git add .
git commit -m "Update CORS with production URL"
git push
```

Railway sẽ tự động redeploy backend (~2 phút).

**✅ Kiểm tra cuối cùng**:
1. Truy cập website Vercel
2. Gửi thử 1 yêu cầu cứu hộ
3. Vào `/dashboard` → Xem yêu cầu hiển thị

---

## 🎉 HOÀN TẤT!

Website của bạn đã LIVE:
- 🌐 Frontend: https://cuuho-emergency-rescue.vercel.app
- ⚙️ Backend: https://cuuho-backend-production.up.railway.app
- 💾 Database: Railway PostgreSQL

---

## ❓ NẾU GẶP LỖI

### "Cannot connect to database"
→ Kiểm tra `DATABASE_URL` trong Railway Variables

### "CORS error"
→ Đảm bảo đã update `enableCors()` với URL Vercel và push code

### "Map không hiển thị"
→ Kiểm tra `NEXT_PUBLIC_MAPBOX_TOKEN` trong Vercel

### "API không hoạt động"
→ Kiểm tra `NEXT_PUBLIC_API_URL` trong Vercel có đúng URL Railway không

---

## 📞 HỖ TRỢ

Nếu cần giúp đỡ, gửi log lỗi từ:
- Railway: Vào service → **Deployments** → Click vào deployment mới nhất → **View Logs**
- Vercel: Vào deployment → **Logs** tab
