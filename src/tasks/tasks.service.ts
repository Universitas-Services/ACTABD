// src/tasks/tasks.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private prisma: PrismaService) {}

  // 👇 Este decorador define cuándo se ejecutará la tarea
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) // Se ejecutará todos los días a medianoche
  // También puedes usar expresiones cron directas: @Cron('0 0 * * *')
  async handleCron() {
    this.logger.log(
      'Ejecutando tarea programada: Limpieza de usuarios no verificados...',
    );

    // 1. Calcula la fecha límite (ej. usuarios creados hace más de 24 horas)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // 2. Busca los usuarios que cumplen las condiciones
    const usersToDelete = await this.prisma.user.findMany({
      where: {
        isEmailVerified: false, // No han verificado su correo
        createdAt: {
          lt: twentyFourHoursAgo, // Fueron creados antes de la fecha límite
        },
      },
      select: {
        id: true, // Solo necesitamos el ID para borrarlos
        email: true,
      },
    });

    if (usersToDelete.length === 0) {
      this.logger.log(
        'No se encontraron usuarios no verificados para eliminar.',
      );
      return;
    }

    this.logger.warn(
      `Se encontraron ${usersToDelete.length} usuarios no verificados para eliminar.`,
    );

    // 3. Elimina los usuarios encontrados
    const deleteResult = await this.prisma.user.deleteMany({
      where: {
        id: {
          in: usersToDelete.map((user) => user.id), // Elimina por la lista de IDs
        },
      },
    });

    this.logger.log(
      `Se eliminaron ${deleteResult.count} usuarios no verificados.`,
    );
  }
}
