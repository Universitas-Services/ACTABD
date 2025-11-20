/*
  Warnings:

  - A unique constraint covering the columns `[numeroCompliance]` on the table `acta_compliance` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "acta_compliance" ADD COLUMN     "numeroCompliance" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "acta_compliance_numeroCompliance_key" ON "acta_compliance"("numeroCompliance");
