# Stage 1: Build
FROM node:18-bullseye AS builder

WORKDIR /app

# Copy package.json & package-lock.json
COPY package*.json ./

# Cài cả devDependencies (eslint, typescript, next)
RUN npm install --include=dev --unsafe-perm

# Copy toàn bộ source
COPY . .

# Build Next.js production, bỏ ESLint
RUN npx next build --no-lint

# Stage 2: Production
FROM node:18-bullseye AS runner

WORKDIR /app
ENV NODE_ENV production
ENV PORT 8080

# Copy standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Start Next.js server
CMD ["node", "server.js"]
