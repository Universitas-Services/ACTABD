/*
  Warnings:

  - You are about to drop the column `actaId` on the `acta_compliance` table. All the data in the column will be lost.
  - Added the required column `userId` to the `acta_compliance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."acta_compliance" DROP CONSTRAINT "acta_compliance_actaId_fkey";

-- DropIndex
DROP INDEX "public"."acta_compliance_actaId_key";

-- AlterTable
ALTER TABLE "acta_compliance" DROP COLUMN "actaId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "acta_compliance" ADD CONSTRAINT "acta_compliance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
