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
      'Iniciando verificación de notificaciones (Plazos y Vencimientos)...',
    );

    // --- 1. NOTIFICACIONES AL ADMIN (30 y 100 días) ---
    await this.handleAdminNotifications();

    // --- 2. NOTIFICACIONES AL USUARIO (Vencimiento de Plazo) ---
    await this.handleUserDeadlineNotifications();

    // --- 3. NOTIFICACIONES AL USUARIO (Recordatorio UAI - 4 días hábiles) ---
    await this.handleUaiDeliveryNotifications();
  }

  // Lógica separada para notificaciones de Admin (existente)
  private async handleAdminNotifications() {
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

    const admins = await this.prisma.user.findMany({
      where: { role: UserRole.ADMIN },
      select: { email: true },
    });
    const adminEmails = admins.map((a) => a.email);

    if (adminEmails.length === 0) return;

    for (const acta of actas) {
      const daysPassed = this.calculateBusinessDaysPassed(acta);
      const notifications = Array.isArray(acta.notificationsSent)
        ? (acta.notificationsSent as string[])
        : [];

      let updated = false;
      const numeroActa = acta.numeroActa || 'S/N';

      if (daysPassed >= 30 && !notifications.includes('30_DAYS')) {
        await this.emailService.sendAdminNotificationDeadline(
          adminEmails,
          numeroActa,
          30,
        );
        notifications.push('30_DAYS');
        updated = true;
      }

      if (daysPassed >= 100 && !notifications.includes('100_DAYS')) {
        await this.emailService.sendAdminNotificationDeadline(
          adminEmails,
          numeroActa,
          100,
        );
        notifications.push('100_DAYS');
        updated = true;
      }

      if (updated) {
        await this.prisma.acta.update({
          where: { id: acta.id },
          data: {
            notificationsSent: notifications,
          } as Prisma.ActaUpdateInput,
        });
      }
    }
  }

  // Lógica NUEVA para notificaciones al Usuario (Deadline Expired)
  private async handleUserDeadlineNotifications() {
    this.logger.log('Verificando vencimiento de plazos de usuarios...');

    // Buscar actas en progreso (no ENTREGADA, no COMPLETADA)
    // y que NO hayan recibido ya la notificación de "DEADLINE_EXPIRED"
    // Nota: notificationsSent es JSON, el filtro de includes en la query de prisma para JSON arrays
    // puede ser limitado dependiendo de la versión/DB. Lo haremos en memoria por seguridad y simplicidad.
    const actasEnProgreso = await this.prisma.acta.findMany({
      where: {
        status: { not: ActaStatus.ENTREGADA },
        isCompleted: false, // Asumiendo que false significa "en borrador/proceso"
      },
      select: {
        id: true,
        createdAt: true,
        tiempoRealizacion: true, // Días seleccionados por el usuario
        userId: true,
        notificationsSent: true,
        user: {
          select: {
            email: true,
            nombre: true,
          },
        },
      },
    });

    const now = new Date();

    for (const acta of actasEnProgreso) {
      const notifications = Array.isArray(acta.notificationsSent)
        ? (acta.notificationsSent as string[])
        : [];

      // Si ya se envió, saltar
      if (notifications.includes('DEADLINE_EXPIRED')) continue;

      // Calcular Fecha Límite usando Días Hábiles
      const deadlineDate = this.addBusinessDays(
        acta.createdAt,
        acta.tiempoRealizacion,
      );

      // Si la fecha actual es MAYOR a la fecha límite => Venció
      if (now > deadlineDate) {
        this.logger.warn(
          `Acta ${acta.id} vencida. Deadline: ${deadlineDate.toISOString()}, Ahora: ${now.toISOString()}`,
        );

        // Enviar Correo
        try {
          // Usamos el nombre del usuario o "Usuario" por defecto
          await this.emailService.sendActaDeadlineExpiredEmail(
            acta.user.email,
            acta.user.nombre || 'Usuario',
          );

          this.logger.log(`Correo de vencimiento enviado a ${acta.user.email}`);

          // Actualizar DB para no reenviar
          notifications.push('DEADLINE_EXPIRED');
          await this.prisma.acta.update({
            where: { id: acta.id },
            data: {
              notificationsSent: notifications,
            } as Prisma.ActaUpdateInput,
          });
        } catch (error) {
          this.logger.error(
            `Error enviando correo de vencimiento para acta ${acta.id}`,
            error,
          );
        }
      }
    }
  }

  // Lógica NUEVA para notificaciones de Entrega UAI (4 días hábiles post-suscripción)
  private async handleUaiDeliveryNotifications() {
    this.logger.log('Verificando recordatorios de entrega a la UAI...');

    // Buscar Actas que:
    // 1. NO estén entregadas
    // 2. Tengan fechaSuscripcion en metadata
    // 3. NO tengan ya la notificación 'UAI_REMINDER'
    // Como el filtro de JSON en Prisma es limitado, traemos las candidatas y filtramos en JS.
    const actasCandidatas = await this.prisma.acta.findMany({
      where: {
        status: { not: ActaStatus.ENTREGADA },
      },
      select: {
        id: true,
        createdAt: true,
        metadata: true,
        userId: true,
        notificationsSent: true,
        user: {
          select: {
            email: true,
            nombre: true,
          },
        },
      },
    });

    for (const acta of actasCandidatas) {
      const notifications = Array.isArray(acta.notificationsSent)
        ? (acta.notificationsSent as string[])
        : [];

      // Si ya se envió, saltar
      if (notifications.includes('UAI_REMINDER')) continue;

      // Calcular días hábiles pasados desde la fecha de suscripción
      const daysPassed = this.calculateBusinessDaysPassed(acta);

      // Si han pasado 4 o más días hábiles, enviar recordatorio
      // (La norma da 5 días, notificamos al 4to para dar margen)
      if (daysPassed >= 4) {
        this.logger.log(
          `Recordatorio UAI enviado para Acta ID ${acta.id} (Han pasado ${daysPassed} días hábiles)`,
        );

        try {
          await this.emailService.sendUaiDeliveryReminder(
            acta.user.email,
            acta.user.nombre || 'Usuario',
          );

          // Actualizar DB
          notifications.push('UAI_REMINDER');
          await this.prisma.acta.update({
            where: { id: acta.id },
            data: {
              notificationsSent: notifications,
            } as Prisma.ActaUpdateInput,
          });
        } catch (error) {
          this.logger.error(
            `Error enviando recordatorio UAI para acta ${acta.id}`,
            error,
          );
        }
      }
    }
  }

  /**
   * Calcula la fecha final sumando 'days' días HÁBILES a 'startDate'.
   * Excluye Sábados (6) y Domingos (0).
   */
  private addBusinessDays(startDate: Date, daysToAdd: number): Date {
    const currentDate = new Date(startDate);
    let addedDays = 0;

    // Si daysToAdd es 0 o negativo, retornamos la misma fecha (o manejamos según lógica de negocio)
    if (daysToAdd <= 0) return currentDate;

    while (addedDays < daysToAdd) {
      // Avanzamos un día
      currentDate.setDate(currentDate.getDate() + 1);

      const dayOfWeek = currentDate.getDay();
      // Si NO es Domingo (0) NI Sábado (6), cuenta como día hábil
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        addedDays++;
      }
    }

    // Opcional: Ajustar al final del día (23:59:59) para solidez en comparaciones
    // Si deadline es Miércoles, vence al terminar el miércoles.
    currentDate.setHours(23, 59, 59, 999);

    return currentDate;
  }

  // Helper para calcular días hábiles pasados desde fechaSuscripcion (Existente)
  private calculateBusinessDaysPassed(acta: {
    createdAt: Date;
    metadata: unknown;
  }): number {
    let startDate = new Date(acta.createdAt);

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

    const today = new Date();
    startDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (today <= startDate) return 0;

    let businessDays = 0;
    const current = new Date(startDate);

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
