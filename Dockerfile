# =========================
# Stage 1: Dependencies
# =========================
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# =========================
# Stage 2: Build
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build app
RUN npm run build

# Remove dev dependencies AFTER build
RUN npm prune --omit=dev

# =========================
# Stage 3: Production
# =========================
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy only what is needed
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next   # if Next.js
COPY --from=builder /app/dist ./dist     # if using dist
COPY --from=builder /app/prisma ./prisma # needed for migrations
COPY --from=builder /app/public ./public # static files

EXPOSE 3000

CMD sh -c "npx prisma migrate deploy && npm start"
