# --- Etapa 1: Builder ---
# Usamos una imagen de Node.js más completa para instalar y construir el proyecto.
FROM node:20-alpine AS builder

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos las dependencias de producción
RUN npm install

# Copiamos el resto del código fuente de la aplicación
COPY . .

# Generamos el cliente de Prisma (esencial para que funcione en el build)
RUN npx prisma generate

# ----  👇 AÑADE ESTA LÍNEA AQUÍ 👇 ----
# Ejecuta las migraciones de la base de datos para producción
RUN npm run prisma:deploy

# Construimos la aplicación de NestJS (compila de TypeScript a JavaScript)
RUN npm run build

# --- Etapa 2: Deploy ---
# Usamos una imagen de Node.js más ligera para la versión final
FROM node:20-alpine

WORKDIR /usr/src/app

# Copiamos las dependencias de producción desde la etapa 'builder'
COPY --from=builder /usr/src/app/node_modules ./node_modules
# Copiamos la aplicación ya compilada desde la etapa 'builder'
COPY --from=builder /usr/src/app/dist ./dist
# Copiamos el schema de Prisma para poder ejecutar migraciones en producción
COPY --from=builder /usr/src/app/prisma ./prisma

# Exponemos el puerto 3000 (el que usa NestJS por defecto)
EXPOSE 3000

# El comando que se ejecutará cuando el contenedor se inicie
CMD ["node", "dist/main"]