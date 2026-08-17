# ACTABD — API de Actas de Entrega

Backend NestJS (TypeScript) para el sistema de actas de entrega de Universitas. Expone una API REST con autenticación JWT, persistencia en PostgreSQL (Prisma) y un chatbot que habla con el **Gateway ADK** en Cloud Run (ya no usa Dialogflow CX).

- Swagger (producción): https://actabd-api-693924722323.us-central1.run.app/api
- Frontend: https://app.actadeentrega.online
- Gateway ADK: https://gateway-actas-entrega-951100463087.us-east1.run.app

```
Frontend (Netlify)
  → esta API (Cloud Run)  POST /ai/message  [JWT + historial]
      → Gateway ADK       POST /api/chat
          → Vertex Agent Engine
  → Cloud SQL PostgreSQL
```

## Requisitos

- Node.js 20+
- PostgreSQL 15+ (local o Cloud SQL)
- Copia de `.env.example` como `.env`

## Configuración

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate deploy
npm run start:dev
```

Swagger local: http://localhost:3000/api

### Docker (API + Postgres local)

```bash
docker compose up --build
```

La API queda en el puerto `3000`. Postgres se publica en `5433`.

## Variables de entorno

| Variable | Uso |
|----------|-----|
| `DATABASE_URL` | Conexión Prisma en runtime |
| `DIRECT_URL` | Conexión directa para `prisma migrate deploy` (puede ser igual a `DATABASE_URL` si no hay pooler) |
| `JWT_SECRET` | Firma de tokens |
| `FRONTEND_URL` | Origen del frontend (enlaces de email) |
| `BACKEND_URL` | URL pública de esta API |
| `RESEND_API_KEY` / `FROM_EMAIL` | Envío de correos |
| `ADK_GATEWAY_URL` | Base URL del Gateway ADK |
| `ADK_GATEWAY_TIMEOUT_MS` | Timeout HTTP al Gateway (default `120000`) |

### Cloud Run + Cloud SQL

```text
postgresql://USER:PASSWORD@localhost:5432/DB_NAME?host=/cloudsql/PROJECT:REGION:INSTANCE
```

Si la contraseña tiene caracteres especiales (`*`, `@`, `#`), hay que URL-encodearlos (`*` → `%2A`).

## Chatbot

El frontend **no** debe llamar al Gateway. Usa esta API:

```http
POST /ai/message
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "message": "Hola, necesito ayuda",
  "sessionId": "id-estable-de-la-conversacion"
}
```

- `message`: 1–4096 caracteres
- `sessionId`: opcional, 1–128 caracteres. Si no viene, el backend genera uno; reutilízalo en la misma conversación.

El backend traduce a `{ "message", "session_id" }` y llama `POST {ADK_GATEWAY_URL}/api/chat`.

## Scripts

```bash
npm run start:dev    # desarrollo
npm run build
npm run start:prod   # node dist/main
npm run test
npx prisma studio    # UI de la base (requiere DATABASE_URL accesible)
```

En Cloud Run el contenedor ejecuta `start.sh`: `prisma generate` → `prisma migrate deploy` → `node dist/main.js`.

## Deploy (GCP)

Imagen: Artifact Registry `us-central1-docker.pkg.dev/agente-manual-contrataciones/actabd/actabd-api`

Servicio Cloud Run: `actabd-api` (región `us-central1`), con instancia Cloud SQL `agente-manual-contrataciones:us-central1:cluster-produccion-01`.

## Licencia

UNLICENSED (proyecto privado Universitas).
