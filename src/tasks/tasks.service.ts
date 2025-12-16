// src/tasks/tasks.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { ActaStatus, UserRole, Prisma } from '@prisma/client';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  // 👇 Este decorador define cuándo se ejecutará la tarea
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) // Se ejecutará todos los días a medianoche
  async handleCron() {
    await this.handleActaNotifications();
  }

  // 👇 Tarea separada para limpieza frecuente (cada minuto)
  @Cron(CronExpression.EVERY_MINUTE)
  async handleCronUserCleanup() {
    await this.handleCleanUnverifiedUsers();
  }

  private async handleCleanUnverifiedUsers() {
    this.logger.log(
      'Ejecutando tarea programada: Limpieza de usuarios no verificados...',
    );

    // 1. Calcula la fecha límite (usuarios creados hace más de 5 minutos)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    // 2. Busca los usuarios que cumplen las condiciones
    const usersToDelete = await this.prisma.user.findMany({
      where: {
        isEmailVerified: false, // No han verificado su correo
        createdAt: {
          lt: fiveMinutesAgo, // Fueron creados antes de hace 5 minutos
        },
      },
      select: {
        id: true, // Solo necesitamos el ID para borrarlos
        email: true,
      },
    });

    if (usersToDelete.length === 0) {
      // this.logger.log('No se encontraron usuarios no verificados para eliminar.');
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

  // --- NUEVA TAREA DE NOTIFICACIONES ---
  private async handleActaNotifications() {
    this.logger.log(
      'Verificando plazos de actas entregadas (30 y 100 días)...',
    );

    // 1. Obtener actas entregadas o completadas, o simplemente todas las que tengan fechaSuscripcion
    // Como la regla es fechaSuscripcion, buscamos actas que no estén "borradas" (aunque no hay soft delete aqui)
    // Filtramos las que tengan status ENTREGADA para ser estrictos, o cualquier status si aplica.
    // Usaremos ENTREGADA como criterio base según requerimiento inicial.
    const actas = await this.prisma.acta.findMany({
      where: {
        status: ActaStatus.ENTREGADA,
      },
      select: {
        id: true,
        numeroActa: true,
        createdAt: true,
        metadata: true,
        notificationsSent: true,
      },
    });

    if (actas.length === 0) return;

    // 2. Obtener correos de administradores
    const admins = await this.prisma.user.findMany({
      where: { role: UserRole.ADMIN },
      select: { email: true },
    });
    const adminEmails = admins.map((a) => a.email);

    if (adminEmails.length === 0) {
      this.logger.warn('No hay administradores a quienes notificar.');
      return;
    }

    for (const acta of actas) {
      const daysPassed = this.calculateBusinessDaysPassed(acta);
      // Cast explícito a string[] para evitar el error de acceso a 'any'
      // Prisma.JsonValue puede ser string | number | boolean | ...
      const notifications = Array.isArray(acta.notificationsSent)
        ? (acta.notificationsSent as string[])
        : [];

      let updated = false;
      const numeroActa = acta.numeroActa || 'S/N';

      // Hito 30 días
      if (daysPassed >= 30 && !notifications.includes('30_DAYS')) {
        await this.emailService.sendAdminNotificationDeadline(
          adminEmails,
          numeroActa,
          30,
        );
        notifications.push('30_DAYS');
        updated = true;
        this.logger.log(
          `Notificación enviada para Acta ${numeroActa} (30 días).`,
        );
      }

      // Hito 100 días
      if (daysPassed >= 100 && !notifications.includes('100_DAYS')) {
        await this.emailService.sendAdminNotificationDeadline(
          adminEmails,
          numeroActa,
          100,
        );
        notifications.push('100_DAYS');
        updated = true;
        this.logger.log(
          `Notificación enviada para Acta ${numeroActa} (100 días).`,
        );
      }

      if (updated) {
        // Casteamos a 'InputJsonValue' o similar según Prisma, pero 'any' aquí es aceptable para escritura rápida si el tipo array es válido
        // Sin embargo, para cumplir con linter, mejor dejar que Prisma infiera o usar 'as any' solo si es estrictamente necesario,
        // pero aquí notifications es string[], Prisma lo acepta para Json.
        await this.prisma.acta.update({
          where: { id: acta.id },
          data: {
            notificationsSent: notifications,
          } as Prisma.ActaUpdateInput & {
            notificationsSent: unknown;
          },
        });
      }
    }
  }

  // Helper para calcular días hábiles pasados desde fechaSuscripcion
  private calculateBusinessDaysPassed(acta: {
    createdAt: Date;
    metadata: unknown;
  }): number {
    let startDate = new Date(acta.createdAt);

    // Verificamos si metadata es un objeto y tiene la propiedad fechaSuscripcion
    if (
      typeof acta.metadata === 'object' &&
      acta.metadata !== null &&
      'fechaSuscripcion' in acta.metadata
    ) {
      const metadata = acta.metadata as {
        fechaSuscripcion: string | number | Date;
      };
      if (metadata.fechaSuscripcion) {
        const fechaSuscripcion = new Date(metadata.fechaSuscripcion);
        if (!isNaN(fechaSuscripcion.getTime())) {
          startDate = fechaSuscripcion;
        }
      }
    }

    // Contamos días hábiles desde startDate hasta hoy
    const today = new Date();
    startDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (today <= startDate) return 0;

    let businessDays = 0;
    const current = new Date(startDate);

    // Avanzamos día a día
    while (current < today) {
      current.setDate(current.getDate() + 1);
      const day = current.getDay();
      if (day !== 0 && day !== 6) {
        businessDays++;
      }
    }
    return businessDays;
  }
}
