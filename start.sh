#!/bin/sh
set -e

echo "🚀 Iniciando despliegue..."

# 1. Generar cliente y aplicar migraciones
echo "🔄 Generando cliente Prisma..."
npx prisma generate

echo "📦 Ejecutando migraciones de Prisma..."
npx prisma migrate deploy

# 2. Iniciar la aplicación
# Intentamos ejecutar. Si main.js cambió de lugar, esto nos ayudará a depurar,
# pero con el cambio en tsconfig debería estar en dist/main.js
echo "🟢 Iniciando servidor NestJS..."
exec node dist/main.js