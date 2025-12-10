# --- Etapa 1: Builder ---
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

# Instalamos dependencias (incluyendo puppeteer)
RUN npm install

COPY . .
RUN npx prisma generate

RUN npm run build

# --- Etapa 2: Deploy ---
FROM node:20-alpine

# 👇 1. INSTALAMOS CHROMIUM Y SUS DEPENDENCIAS NECESARIAS
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont

# 👇 2. CONFIGURAMOS LA VARIABLE DE ENTORNO PARA PUPPETEER
# Esto le dice a Puppeteer: "No busques tu versión descargada, usa la que acabo de instalar"
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

COPY start.sh .
# Fix Windows line endings (CRLF) -> Linux (LF)
RUN apk add --no-cache dos2unix && dos2unix start.sh
RUN chmod +x ./start.sh

EXPOSE 3000

CMD ["./start.sh"]