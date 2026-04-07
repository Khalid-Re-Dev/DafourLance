# # Stage 1: Install dependencies
# FROM node:20 AS deps
# WORKDIR /app
# COPY package.json package-lock.json* pnpm-lock.yaml* ./
# RUN npm install
# # or if you use pnpm: RUN npm install -g pnpm && pnpm install

# # Stage 2: Build and generate Prisma client 
# FROM node:20 AS builder
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .

# # Generate Prisma client before building Next.js
# RUN npx prisma generate

# # Build Next.js app
# RUN npm run build

# # Stage 3: Production image
# FROM node:20 AS runner
# WORKDIR /app
# ENV NODE_ENV=production

# COPY --from=builder /app ./

# EXPOSE 3002
# CMD ["npm", "start"]


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

# WARNING: In production (e.g., CapRover or Docker), local image uploads saved to public/uploads 
# will be lost when the container restarts or rebuilds. 
# You MUST mount a persistent volume to /app/public/uploads in your deployment settings.

COPY --from=builder /app ./

EXPOSE 3000

CMD sh -c "npx prisma migrate deploy && npx prisma db seed && npm start"
