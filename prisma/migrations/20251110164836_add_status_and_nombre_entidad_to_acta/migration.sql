/*
  Warnings:

  - You are about to drop the column `ciudad` on the `Acta` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Acta` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `Acta` table. All the data in the column will be lost.
  - You are about to drop the column `fecha` on the `Acta` table. All the data in the column will be lost.
  - You are about to drop the column `nombre_entidad` on the `Acta` table. All the data in the column will be lost.
  - You are about to drop the column `numero_acta` on the `Acta` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[numeroActa]` on the table `Acta` will be added. If there are existing duplicate values, this will fail.
  - Made the column `metadata` on table `Acta` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ActaStatus" AS ENUM ('GUARDADA', 'DESCARGADA', 'ENVIADA');

-- DropIndex
DROP INDEX "public"."Acta_numero_acta_key";

-- AlterTable
ALTER TABLE "Acta" DROP COLUMN "ciudad",
DROP COLUMN "created_at",
DROP COLUMN "estado",
DROP COLUMN "fecha",
DROP COLUMN "nombre_entidad",
DROP COLUMN "numero_acta",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "nombreEntidad" TEXT,
ADD COLUMN     "numeroActa" TEXT,
ADD COLUMN     "status" "ActaStatus" NOT NULL DEFAULT 'GUARDADA',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "metadata" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Acta_numeroActa_key" ON "Acta"("numeroActa");
