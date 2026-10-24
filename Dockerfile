# ---------- Stage 1: build ----------
FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Các biến này bị "nướng" vào JS lúc build → mỗi môi trường phải build 1 image riêng
ARG NEXT_PUBLIC_API_URL=http://localhost:8080
ARG NEXT_PUBLIC_APP_ENV=local
ARG NEXT_PUBLIC_APP_VERSION=dev
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---------- Stage 2: runtime ----------
FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static

USER node
EXPOSE 3000
CMD ["node", "server.js"]
