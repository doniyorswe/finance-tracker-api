# syntax=docker/dockerfile:1

# ---------- base ----------
FROM node:24-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl
ENV PRISMA_HIDE_UPDATE_MESSAGE=1

# ---------- deps: barcha paketlar (dev bilan) ----------
FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm ci

# ---------- development: hot-reload ----------
FROM deps AS development
ENV NODE_ENV=development
COPY . .
EXPOSE 3000 9229
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && npm run start:dev"]

# ---------- build: kompilyatsiya + dev paketlarni olib tashlash ----------
FROM deps AS build
COPY . .
RUN npx prisma generate \
  && npm run build \
  && npm prune --omit=dev --ignore-scripts

# ---------- production: minimal runtime ----------
FROM base AS production
ENV NODE_ENV=production
COPY --from=build --chown=node:node /app/package.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/prisma ./prisma
COPY --from=build --chown=node:node /app/prisma.config.ts ./
USER node
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
