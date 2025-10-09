# --- Etapa 1: Builder ---
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

# --- Etapa 2: Deploy ---
FROM node:20-alpine

WORKDIR /usr/src/app

# Copia el package.json para que los scripts de npm (como "start:prod") funcionen
COPY --from=builder /usr/src/app/package*.json ./

# Copia el package.json para que los scripts de npm (como "start:prod") funcionen
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

# Copia y da permisos de ejecución al script de inicio
COPY start.sh .
RUN chmod +x ./start.sh

EXPOSE 3000

# El comando de inicio se configurará en Render, no aquí.
CMD ["./start.sh"]