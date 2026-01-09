-- CreateTable
CREATE TABLE "acta_observaciones" (
    "id" TEXT NOT NULL,
    "actaId" TEXT NOT NULL,
    "totalHallazgos" INTEGER NOT NULL,
    "analisis" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "acta_observaciones_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "acta_observaciones" ADD CONSTRAINT "acta_observaciones_actaId_fkey" FOREIGN KEY ("actaId") REFERENCES "Acta"("id") ON DELETE CASCADE ON UPDATE CASCADE;
