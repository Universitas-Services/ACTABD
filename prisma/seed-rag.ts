/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-require-imports */

import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

// Usamos require para compatibilidad con la librería PDF
const pdf = require('pdf-extraction');

// --- CONFIGURACIÓN ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const PDF_FOLDER_PATH = './leyes'; // Carpeta en la raíz del proyecto

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');

// Usamos el modelo específico para vectores
const embeddingModel = genAI.getGenerativeModel({
  model: 'text-embedding-004',
});

async function getEmbedding(text: string) {
  // Genera el vector (lista de 768 números)
  const result = await embeddingModel.embedContent(text);
  return result.embedding.values;
}

async function processPdf(filePath: string) {
  console.log(`📄 Procesando archivo: ${path.basename(filePath)}...`);

  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    const fullText = data.text;

    // Validación básica
    if (!fullText || fullText.length < 100) {
      console.warn(
        '   ⚠️ El PDF parece vacío o es una imagen escaneada (sin texto seleccionable).',
      );
      return;
    }

    // ESTRATEGIA DE CHUNKING (Fragmentación)
    // Dividimos por párrafos dobles para capturar artículos completos
    const chunks: any[] = fullText
      .split(/\n\s*\n/)
      .filter((c: any) => c.length > 50);

    console.log(
      `   🧩 Generando vectores para ${chunks.length} fragmentos de texto...`,
    );

    let processedCount = 0;
    for (const chunk of chunks) {
      // Limpieza de espacios extra
      const cleanChunk = chunk.replace(/\s+/g, ' ').trim();

      // 1. Generar Vector con Google
      const vector = await getEmbedding(cleanChunk);

      // 2. Guardar en PostgreSQL (pgvector)
      // Usamos SQL puro ($executeRaw) porque Prisma aún no soporta nativamente la inserción directa de vectores
      const fileName = path.basename(filePath);
      const vectorString = `[${vector.join(',')}]`;

      await prisma.$executeRaw`
        INSERT INTO "legal_documents" ("id", "content", "source", "embedding", "created_at")
        VALUES (gen_random_uuid(), ${cleanChunk}, ${fileName}, ${vectorString}::vector, NOW());
      `;

      processedCount++;
      // Barra de progreso visual (un punto cada 10 chunks)
      if (processedCount % 10 === 0) process.stdout.write('.');
    }
    console.log(`\n✅ Terminado: ${path.basename(filePath)}\n`);
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error);
  }
}

async function main() {
  console.log('🚀 INICIANDO SISTEMA DE INGESTA RAG (VECTOR STORE)...');

  if (!GEMINI_API_KEY) {
    console.error(
      '❌ Error: No se encontró GEMINI_API_KEY en las variables de entorno (.env).',
    );
    return;
  }

  // --- PASO DE LIMPIEZA (Opción A) ---
  console.log('🧹 Limpiando base de conocimientos antigua...');
  try {
    // Borra todos los registros para evitar duplicados y empezar limpio
    await prisma.$executeRaw`TRUNCATE TABLE "legal_documents";`;
    console.log('✨ Base de datos limpia. Listo para aprender nuevas leyes.');
  } catch (e) {
    console.warn(
      '⚠️ No se pudo limpiar la tabla (puede que sea la primera vez que corre). Continuando...',
      e,
    );
  }
  // ------------------------------------

  if (!fs.existsSync(PDF_FOLDER_PATH)) {
    console.error(
      `❌ No existe la carpeta "${PDF_FOLDER_PATH}" en la raíz del proyecto.`,
    );
    return;
  }

  // Filtramos solo archivos .pdf
  const files = fs
    .readdirSync(PDF_FOLDER_PATH)
    .filter((f) => f.toLowerCase().endsWith('.pdf'));

  if (files.length === 0) {
    console.error(
      '❌ La carpeta "leyes" está vacía. Por favor agrega tus documentos PDF.',
    );
    return;
  }

  console.log(`📚 Se encontraron ${files.length} documentos para procesar.`);

  // Procesamos cada archivo secuencialmente
  for (const file of files) {
    await processPdf(path.join(PDF_FOLDER_PATH, file));
  }

  console.log('\n🏁 INGESTA COMPLETADA.');
  console.log(
    'La Inteligencia Artificial ahora tiene acceso a todas las leyes procesadas en la base de datos.',
  );
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
