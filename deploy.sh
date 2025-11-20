#!/bin/bash

echo "🚀 Emergency Rescue Platform - Deploy Script"
echo "============================================"
echo ""

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null
then
    echo "❌ GitHub CLI chưa được cài đặt."
    echo "📥 Cài đặt: brew install gh"
    echo ""
    echo "Hoặc làm thủ công:"
    echo "1. Vào https://github.com/new"
    echo "2. Tạo repo mới tên: cuuho-emergency-rescue"
    echo "3. Chạy:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/cuuho-emergency-rescue.git"
    echo "   git push -u origin main"
    exit 1
fi

# Create GitHub repo
echo "📦 Đang tạo GitHub repository..."
gh repo create cuuho-emergency-rescue --public --source=. --remote=origin --push

echo ""
echo "✅ Repository đã được tạo và push code thành công!"
echo ""
echo "🔗 Link repo: https://github.com/$(gh api user -q .login)/cuuho-emergency-rescue"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 BƯỚC TIẾP THEO:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1️⃣  DEPLOY BACKEND (Railway):"
echo "   🔗 https://railway.app/new"
echo "   → Deploy from GitHub repo"
echo "   → Chọn: cuuho-emergency-rescue"
echo "   → Root Directory: backend"
echo "   → Add Variables:"
echo "      DATABASE_URL=postgresql://postgres:PaxpUQXUNEJWFSdAYFuIlRtGCtKzmWfz@maglev.proxy.rlwy.net:25980/railway"
echo "      NODE_ENV=production"
echo ""
echo "2️⃣  DEPLOY FRONTEND (Vercel):"
echo "   🔗 https://vercel.com/new"
echo "   → Import Git Repository"
echo "   → Chọn: cuuho-emergency-rescue"
echo "   → Root Directory: frontend"
echo "   → Add Environment Variables:"
echo "      NEXT_PUBLIC_API_URL=[Railway Backend URL]"
echo "      NEXT_PUBLIC_MAPBOX_TOKEN=[Get from mapbox.com]"
echo ""
echo "📖 Chi tiết: Xem file DEPLOY_GUIDE.md"
echo ""
