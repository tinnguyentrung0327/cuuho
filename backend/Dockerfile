# --- Stage 1: Builder ---
# Use Debian-based image instead of Alpine to avoid Prisma OpenSSL issues
FROM --platform=linux/amd64 node:18-slim AS builder

WORKDIR /app

# Copy các file định nghĩa package trước để tận dụng Docker layer caching
COPY package*.json ./
COPY prisma ./prisma/

# Cài đặt toàn bộ dependencies (bao gồm devDependencies để build)
# Dùng 'npm ci' nhanh và chuẩn hơn 'npm install' trong môi trường CI/CD
RUN npm ci

# Copy toàn bộ source code
COPY . .

# Generate Prisma Client (cần thiết để build code TypeScript)
RUN npx prisma generate

# Build NestJS (tạo thư mục dist)
RUN npm run build

# --- Stage 2: Production ---
FROM --platform=linux/amd64 node:18-slim AS runner

# Install OpenSSL (required by Prisma)
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Copy package files và prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Copy thư mục build từ stage builder
COPY --from=builder /app/dist ./dist

# Copy node_modules từ builder (bao gồm cả @prisma/client)
# Điều này đảm bảo Prisma Client đã được generate đúng cách
COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 8080

# Start command
# NestJS build với sourceRoot: "src" tạo output: dist/src/main.js
CMD ["node", "dist/src/main.js"]