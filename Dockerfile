# =========================
# Stage 1: Dependencies
# =========================
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json ./
COPY package-lock.json* ./

RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
