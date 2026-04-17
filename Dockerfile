# Stage 1: Install dependencies
FROM node:20 AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# Stage 2: Build
FROM node:20 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 3: Production
FROM node:20 AS runner
WORKDIR /app
ENV NODE_ENV=production

# WARNING: In production (e.g., CapRover or Docker):
# 1. Local image uploads saved to public/uploads will be lost on container rebuild.
#    → Mount a persistent volume to /app/public/uploads
# 2. SQLite database (prisma/dev.db) will be lost on container rebuild.
#    → Mount a persistent volume to /app/prisma
#    Without this, ALL CMS content will be reset on every deploy!

COPY --from=builder /app ./

EXPOSE 3000

# On container start:
# 1. Apply any pending database migrations
# 2. Seed the database with CMS content (uses upsert — safe to re-run)
# 3. Start the Next.js production server
CMD sh -c "npx prisma migrate deploy && npx prisma db seed && npm start"
