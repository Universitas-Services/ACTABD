// src/acta-compliance/acta-compliance.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActaComplianceDto } from './dto/create-acta-compliance.dto';
import { UpdateActaComplianceDto } from './dto/update-acta-compliance.dto';
import { ActaCompliance, Prisma } from '@prisma/client';

@Injectable()
export class ActaComplianceService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crea un nuevo registro de checklist de cumplimiento.
   * Asocia el checklist al usuario que lo está creando.
   */
  async create(
    createActaComplianceDto: CreateActaComplianceDto,
    userId: string,
  ): Promise<ActaCompliance> {
    // 1. Calcular puntaje y resumen
    const puntajeCalculado = this.calculateScore(createActaComplianceDto);
    const resumenCumplimiento = this.generateSummary(
      puntajeCalculado,
      createActaComplianceDto,
    );

    // 2. Crear el registro en la base de datos
    try {
      const newCompliance = await this.prisma.actaCompliance.create({
        data: {
          ...createActaComplianceDto,
          puntajeCalculado,
          resumenCumplimiento,
          userId: userId, // <-- FORMA CORRECTA de asociar por ID
        },
      });
      return newCompliance;
    } catch (error: unknown) {
      // Manejar errores de Prisma de forma segura
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new Error(
        `Error al crear el registro de cumplimiento: ${errorMessage}`,
      );
    }
  }

  /**
   * Obtiene todos los checklists de cumplimiento (general).
   * Podrías querer filtrar esto por admin/roles en el futuro.
   */
  async findAll(): Promise<ActaCompliance[]> {
    return this.prisma.actaCompliance.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, email: true, nombre: true } } }, // Incluye info básica del usuario
    });
  }

  /**
   * Obtiene todos los checklists de cumplimiento CREADOS POR un usuario específico.
   */
  async findAllForUser(userId: string): Promise<ActaCompliance[]> {
    return this.prisma.actaCompliance.findMany({
      where: { userId: userId }, // Filtra por el ID del usuario
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Obtiene un checklist específico por su ID.
   */
  async findOne(id: string): Promise<ActaCompliance> {
    const compliance = await this.prisma.actaCompliance.findUnique({
      where: { id },
    });
    if (!compliance) {
      throw new NotFoundException(
        `Checklist de cumplimiento con ID ${id} no encontrado.`,
      );
    }
    return compliance;
  }

  /**
   * Actualiza un checklist de cumplimiento.
   */
  async update(
    id: string,
    updateActaComplianceDto: UpdateActaComplianceDto,
  ): Promise<ActaCompliance> {
    // 1. Obtiene los datos existentes para recalcular
    const existingData = await this.findOne(id);
    const newData = { ...existingData, ...updateActaComplianceDto };

    // 2. Recalcular puntaje y resumen
    const puntajeCalculado = this.calculateScore(newData);
    const resumenCumplimiento = this.generateSummary(puntajeCalculado, newData);

    // 3. Actualizar en la base de datos
    try {
      const updatedCompliance = await this.prisma.actaCompliance.update({
        where: { id },
        data: {
          ...updateActaComplianceDto, // Aplica los cambios del DTO
          puntajeCalculado, // Actualiza el puntaje
          resumenCumplimiento, // Actualiza el resumen
        },
      });
      return updatedCompliance;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          `Checklist de cumplimiento con ID ${id} no encontrado.`,
        );
      }
      throw error;
    }
  }

  /**
   * Elimina un checklist de cumplimiento.
   */
  async remove(id: string): Promise<ActaCompliance> {
    try {
      const deletedCompliance = await this.prisma.actaCompliance.delete({
        where: { id },
      });
      return deletedCompliance;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          `Checklist de cumplimiento con ID ${id} no encontrado.`,
        );
      }
      throw error;
    }
  }

  // --- LÓGICA DE NEGOCIO (Basada en tu documentación) ---
  // (Estos son los métodos que calculan el resultado)

  private getPonderaciones(): { [key: string]: number } {
    // Mapeo de preguntas a ponderaciones (basado en tu doc)
    return {
      q1: 1,
      q2: 1,
      q3: 1,
      q4: 1,
      q5: 1,
      q6: 1,
      q7: 1,
      q8: 1,
      q9: 1,
      q10: 2,
      q11: 2,
      q12: 2,
      q13: 1,
      q14: 2,
      q15: 2,
      q16: 2,
      q17: 1,
      q18: 1,
      q19: 1,
      q20: 1,
      q21: 0, // q21 no tiene ponderación
      q22: 1,
      q23: 2,
      q24: 0, // q24 no tiene ponderación
      q25: 2,
      q26: 2,
      q27: 2,
      q28: 1,
      q29: 1.3,
      q30: 1.31,
      q31: 1.32,
      q32: 1.33,
      q33: 1.34,
      q34: 1.35,
      q35: 1.36,
      q36: 1.37,
      q37: 1.38,
      q38: 1.39,
      q39: 1.4,
      q40: 1.41,
      q41: 1.42,
      q42: 1.43,
      q43: 1.44,
      q44: 1.45,
      q45: 1.46,
      q46: 1.47,
      q47: 1.48,
      q48: 1.49,
      q49: 1.5,
      q50: 1.51,
      q51: 1.52,
      q52: 1.53,
      q53: 1.54,
      q54: 1.55,
      q55: 1.56,
      q56: 1.57,
      q57: 1.58,
      q58: 1.59,
      q59: 1.6,
      q60: 1.61,
      q61: 1.62,
      q62: 1.63,
      q63: 1.64,
      q64: 1.65,
      q65: 1.66,
      q66: 1.67,
      q67: 1.68,
      q68: 1.69,
      q69: 1.7,
      q70: 1.71,
      q71: 1.72,
      q72: 1.73,
      q73: 1.74,
      q74: 1.75,
      q75: 1.76,
      // q76-q98 no tienen ponderación definida en tu doc, asumo 0
      q76: 0,
      q77: 0,
      q78: 0,
      q79: 0,
      q80: 0,
      q81: 0,
      q82: 0,
      q83: 0,
      q84: 0,
      q85: 0,
      q86: 0,
      q87: 0,
      q88: 0,
      q89: 0,
      q90: 0,
      q91: 0,
      q92: 0,
      q93: 0,
      q94: 0,
      q95: 0,
      q96: 0,
      q97: 0,
      q98: 0,
    };
  }

  private calculateScore(data: Record<string, any>): number {
    const ponderaciones = this.getPonderaciones();
    const maxScore = Object.values(ponderaciones).reduce(
      (sum, val) => sum + (val || 0),
      0,
    );
    let obtainedScore = 0;

    // Itera sobre las 98 preguntas
    for (let i = 1; i <= 98; i++) {
      // Encuentra el nombre completo de la clave (ej. q1_acta_contiene_lugar_suscripcion)
      const dataKey = Object.keys(data).find((k) => k.startsWith(`q${i}_`));
      const ponderacionKey = `q${i}`;

      if (dataKey && data[dataKey] === true && ponderaciones[ponderacionKey]) {
        obtainedScore += ponderaciones[ponderacionKey];
      }
    }

    if (maxScore === 0) return 0;
    const scorePercentage = (obtainedScore / maxScore) * 100;
    return Math.round(scorePercentage);
  }

  private generateSummary(score: number, data: Record<string, any>): string {
    let algunaRespuesta = false;
    for (let i = 1; i <= 98; i++) {
      const dataKey = Object.keys(data).find((k) => k.startsWith(`q${i}_`));
      if (dataKey && (data[dataKey] === true || data[dataKey] === false)) {
        algunaRespuesta = true;
        break;
      }
    }

    if (!algunaRespuesta) {
      return 'Tras revisar las respuestas obtenidas en el Formulario de Revisión de Cumplimiento para el Acta de Entrega, hemos identificado que los resultados indican Ausencia del documento objeto de la revisión; lamentamos informar que esta situación supone un incumplimiento general de la normativa y la imposibilidad de aplicar el resto del formato de evaluación.';
    }

    const textoBase =
      'Tras revisar las respuestas obtenidas en el Formulario de Revisión de Cumplimiento para el Acta de Entrega, hemos identificado que los resultados reflejan incumplimientos con respecto a las normas establecidas por la Contraloría General de la República. Estas normas regulan la entrega de los órganos y entidades de la administración pública, así como de sus respectivas oficinas o dependencias, conforme a la Resolución N° 01-00-000162 del 28 de julio de 2009.';
    const puntajeTexto = `con una puntuación de (${score}/100)`;

    if (score >= 1 && score <= 50) {
      return `${textoBase} Los incumplimientos han sido clasificados en un nivel Alto o Crítico, ${puntajeTexto}. Esta calificación indica la existencia de fallos significativos o sustanciales en la correcta aplicación de la normativa legal, lo que requiere atención inmediata para asegurar el cumplimiento de los estándares establecidos.`;
    }
    if (score >= 51 && score <= 75) {
      return `${textoBase} Los incumplimientos han sido clasificados en un nivel Intermedio, ${puntajeTexto}. Esta calificación indica la existencia de fallos interpretativos o desconocimiento en la correcta aplicación de la normativa legal, lo que requiere atención inmediata para asegurar el cumplimiento de los estándares establecidos.`;
    }
    if (score >= 76 && score <= 99) {
      return `${textoBase} Los incumplimientos han sido clasificados en un nivel Bajo o Leve, ${puntajeTexto}, Esta calificación indica la existencia de fallos por deficiencias o inexactitudes en la correcta aplicación de la normativa legal, lo que requiere atención inmediata para asegurar el cumplimiento de los estándares establecidos.`;
    }
    if (score === 100) {
      return `Tras revisar las respuestas obtenidas en el Formulario de Revisión de Cumplimiento para el Acta de Entrega, los resultados indican un cumplimiento total con las normas establecidas por la Contraloría General de la República, conforme a la Resolución N° 01-00-000162 del 28 de julio de 2009. La puntuación obtenida es (${score}/100).`;
    }

    // Caso de score 0 pero con respuestas
    return 'Tras revisar las respuestas, se ha determinado un puntaje de 0, indicando incumplimiento total en los items evaluados.';
  }
}
