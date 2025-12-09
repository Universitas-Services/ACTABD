/*
  Warnings:

  - You are about to drop the column `apellido` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `confirmation_token` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `hashedRefreshToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `is_email_verified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `otp` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `otp_expires_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `telefono` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."User_confirmation_token_key";

-- DropIndex
DROP INDEX "public"."User_email_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "apellido",
DROP COLUMN "confirmation_token",
DROP COLUMN "created_at",
DROP COLUMN "email",
DROP COLUMN "hashedRefreshToken",
DROP COLUMN "is_email_verified",
DROP COLUMN "nombre",
DROP COLUMN "otp",
DROP COLUMN "otp_expires_at",
DROP COLUMN "password",
DROP COLUMN "role",
DROP COLUMN "telefono";
