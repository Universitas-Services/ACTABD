-- CreateEnum
CREATE TYPE "public"."ActaType" AS ENUM ('ENTRANTE_GRATIS', 'SALIENTE_GRATIS', 'MAXIMA_AUTORIDAD_GRATIS', 'MAXIMA_AUTORIDAD_PAGA', 'ENTRANTE_PAGA', 'SALIENTE_PAGA');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT,
    "telefono" TEXT,
    "role" TEXT NOT NULL DEFAULT 'User',
    "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "confirmation_token" TEXT,
    "otp" TEXT,
    "otp_expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserProfile" (
    "id" TEXT NOT NULL,
    "institucion" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "plazo_entrega_acta" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Acta" (
    "id" TEXT NOT NULL,
    "numero_acta" TEXT NOT NULL,
    "type" "public"."ActaType" NOT NULL,
    "nombre_entidad" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Acta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ChatHistory" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "userMessage" TEXT NOT NULL,
    "botResponse" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ChatHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TokenDenylist" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiry" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TokenDenylist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_confirmation_token_key" ON "public"."User"("confirmation_token");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "public"."UserProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Acta_numero_acta_key" ON "public"."Acta"("numero_acta");

-- AddForeignKey
ALTER TABLE "public"."UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Acta" ADD CONSTRAINT "Acta_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChatHistory" ADD CONSTRAINT "ChatHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
