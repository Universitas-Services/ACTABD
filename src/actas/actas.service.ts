// src/actas/actas.service.ts

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActaDto } from '../auth/dto/create-acta.dto';
import { UpdateActaDto } from '../auth/dto/update-acta.dto';
import { User, Acta, ActaStatus, Prisma, ActaType } from '@prisma/client';
import { ActaDocxService } from './acta-docx.service';
import { GetActasFilterDto } from './dto/get-actas-filter.dto';
import { EmailService } from '../email/email.service';

// Tipo enriquecido para el retorno (intersection type)
type EnrichedActa = Acta & {
  diasRestantes?: number;
  alertaVencimiento?: boolean;
};

@Injectable()
export class ActasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly actaDocxService: ActaDocxService,
    private readonly emailService: EmailService,
  ) {}

  async create(createActaDto: CreateActaDto, user: User) {
    const { type, nombreEntidad, metadata, tiempoRealizacion } = createActaDto;

    // 1. Generamos el número de acta con la lógica corregida (Último + 1)
    const numeroActa = await this.generarNumeroActa();

    const metadataCompleto = {
      ...metadata,
      nombreEntidad: nombreEntidad,
      nombreOrgano: nombreEntidad,
      numeroActa: numeroActa,
      type: type,
    };

    const isCompleted = this.checkMetadataCompletion(metadataCompleto);

    const nuevaActa = await this.prisma.acta.create({
      data: {
        numeroActa: numeroActa,
        nombreEntidad: nombreEntidad,
        type: type,
        status: isCompleted ? ActaStatus.COMPLETADA : ActaStatus.GUARDADA,
        userId: user.id,
        metadata: metadataCompleto,
        isCompleted: isCompleted,
        tiempoRealizacion: tiempoRealizacion, // <-- Guardamos el tiempo
      },
    });

    // Enviar correo de seguimiento personalizado tras el primer guardado
    // Según Resolución N.º 01-00-0162, el plazo es de 3 días hábiles.
    try {
      // Calculamos los días restantes considerando un plazo legal de 3 días hábiles
      const daysRemaining = this.calculateBusinessDaysRemaining(
        nuevaActa,
        3, // Plazo legal Resolución CGR
      );

      // El correo se envía de forma asíncrona sin bloquear la respuesta
      this.emailService
        .sendFollowUpActaEmail(user.email, user.nombre, daysRemaining)
        .catch((err) =>
          console.error('Error enviando email de seguimiento:', err),
        );
    } catch (error) {
      console.error('Error calculando días para email de seguimiento:', error);
    }

    return nuevaActa;
  }

  // --- CAMBIO ROBUSTO PARA EVITAR DUPLICADOS ---
  private async generarNumeroActa(): Promise<string> {
    // 1. Buscamos el acta con el número más alto ordenando por numeroActa DESC
    // Nota: Como es string ("ACTA-XXXX"), el orden alfabético funciona bien si el padding es consistente
    const lastActa = await this.prisma.acta.findFirst({
      where: {
        numeroActa: { not: null },
      },
      orderBy: { numeroActa: 'desc' },
    });

    let nextNumber = 1;

    if (lastActa && lastActa.numeroActa) {
      const parts = lastActa.numeroActa.split('-');
      if (parts.length === 2) {
        const lastSequence = parseInt(parts[1], 10);
        if (!isNaN(lastSequence)) {
          nextNumber = lastSequence + 1;
        }
      }
    }

    // 2. Loop de seguridad: Verificamos si existe por si acaso (race condition)
    let candidate = `ACTA-${nextNumber.toString().padStart(4, '0')}`;
    let exists = await this.prisma.acta.findUnique({
      where: { numeroActa: candidate },
    });

    while (exists) {
      nextNumber++;
      candidate = `ACTA-${nextNumber.toString().padStart(4, '0')}`;
      exists = await this.prisma.acta.findUnique({
        where: { numeroActa: candidate },
      });
    }

    return candidate;
  }

  private checkMetadataCompletion(metadata: any): boolean {
    if (!metadata || typeof metadata !== 'object') {
      return false;
    }
    // Cuenta las llaves del objeto JSON
    return Object.keys(metadata as Record<string, any>).length >= 54;
  }
  // -----------------------------

  async findAllForUser(user: User, filterDto: GetActasFilterDto) {
    const { search, status, type, page = 1, limit = 10 } = filterDto;
    const skip = (page - 1) * limit;

    const where: Prisma.ActaWhereInput = {
      userId: user.id,
    };

    if (status) where.status = status;
    if (type) where.type = type;

    if (search) {
      where.OR = [
        {
          nombreEntidad: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          numeroActa: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [total, data] = await this.prisma.$transaction([
      this.prisma.acta.count({ where }),
      this.prisma.acta.findMany({
        where,
        take: limit,
        skip: skip,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          numeroActa: true,
          nombreEntidad: true,
          type: true,
          status: true,
          createdAt: true,
          isCompleted: true, // Incluimos isCompleted en la respuesta
          tiempoRealizacion: true, // <-- Necesario para el cálculo
          metadata: true, // <-- Necesario para fechaSuscripcion
        },
      }),
    ]);

    // Mapeamos para calcular los días restantes en cada acta
    const dataConDiasRestantes = data.map((acta) => {
      // Necesitamos 'tiempoRealizacion' que no estaba en el select, así que lo añadimos al select abajo
      // Ojo: Si usas 'select', Prisma solo devuelve eso. Hay que añadir 'tiempoRealizacion' al select.
      const diasRestantes = this.calculateBusinessDaysRemaining(
        acta, // Pasamos el acta completa para extraer metadata
        120, // NUEVO PLAZO: 120 días siempre
      );

      const alertaVencimiento = this.checkIfLate(acta);

      return { ...acta, diasRestantes, alertaVencimiento };
    });

    return {
      data: dataConDiasRestantes,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        limit,
      },
    };
  }

  // --- NUEVO MÉTODO PARA ADMIN (CON FILTROS) ---
  async findAll(filterDto?: GetActasFilterDto) {
    const {
      search,
      type,
      status, // Añadido status también
      userId, // <-- Nuevo filtro
      page = 1,
      limit = 10,
    } = filterDto || {}; // Si no se pasa DTO, valores por defecto

    const skip = (page - 1) * +limit;

    const where: Prisma.ActaWhereInput = {};

    if (userId) where.userId = userId; // <-- Aplica filtro de usuario
    if (type) where.type = type;
    if (status) where.status = status;

    if (search) {
      where.OR = [
        { nombreEntidad: { contains: search, mode: 'insensitive' } },
        { numeroActa: { contains: search, mode: 'insensitive' } },
        // Búsqueda por RIF dentro del JSON metadata
        {
          metadata: {
            path: ['rif'],
            string_contains: search,
          },
        },
        // Intento alternativo por si la clave es diferente (ej. rifEntidad)
        {
          metadata: {
            path: ['rifEntidad'],
            string_contains: search,
          },
        },
      ];
    }

    const [total, actas] = await this.prisma.$transaction([
      this.prisma.acta.count({ where }),
      this.prisma.acta.findMany({
        where,
        take: +limit,
        skip,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              nombre: true,
              email: true,
            },
          },
        },
      }),
    ]);

    // 2. Calcular días restantes para cada una (opcional, si se requiere en admin)
    const data = actas.map((acta) => {
      const diasRestantes = this.calculateBusinessDaysRemaining(acta, 120);
      const alertaVencimiento = this.checkIfLate(acta);
      return {
        ...acta,
        diasRestantes,
        alertaVencimiento,
      };
    });

    return {
      data,
      meta: {
        total,
        page: +page,
        lastPage: Math.ceil(total / +limit),
        limit: +limit,
      },
    };
  }

  async findOne(id: string): Promise<EnrichedActa> {
    const acta = await this.prisma.acta.findUnique({
      where: { id },
    });

    if (!acta) {
      throw new NotFoundException('Acta no encontrada');
    }

    // Calcular días restantes para el detalle
    const diasRestantes = this.calculateBusinessDaysRemaining(
      acta,
      120, // NUEVO PLAZO: 120 días
    );

    const alertaVencimiento = this.checkIfLate(acta);

    return { ...acta, diasRestantes, alertaVencimiento };
  }

  async findOneForUser(id: string, user: User): Promise<EnrichedActa> {
    const acta = await this.findOne(id);
    this.checkActaOwnership(acta, user.id);
    return acta;
  }

  async update(id: string, updateActaDto: UpdateActaDto, user: User) {
    const currentActa = await this.findOneForUser(id, user);

    // --- VALIDACIÓN DE BLOQUEO (DESHABILITADA POR SOLICITUD) ---
    // if (currentActa.status === ActaStatus.ENTREGADA) {
    //   throw new ForbiddenException(
    //     'El acta está marcada como ENTREGADA y no se puede editar.',
    //   );
    // }
    // -----------------------------

    const { nombreEntidad, type, metadata, tiempoRealizacion, createdAt } =
      updateActaDto;

    const dataToUpdate: Prisma.ActaUpdateInput = {};

    if (createdAt) {
      dataToUpdate.createdAt = new Date(createdAt);
    }

    if (nombreEntidad) {
      dataToUpdate.nombreEntidad = nombreEntidad;
    }
    if (type) {
      dataToUpdate.type = type;
    }
    if (tiempoRealizacion !== undefined) {
      dataToUpdate.tiempoRealizacion = tiempoRealizacion;
    }

    if (metadata || nombreEntidad) {
      const newMetadata = {
        ...(currentActa.metadata as Record<string, any>),
        ...(metadata || {}),
      };

      if (nombreEntidad) {
        newMetadata.nombreEntidad = nombreEntidad;
        newMetadata.nombreOrgano = nombreEntidad;
      }

      // --- LOGICA NUEVA PARA RESETEAR NOTIFICACIONES ---
      // Si cambia la fecha de suscripción, debemos reiniciar el contador de notificaciones
      // para que se vuelvan a enviar a los 30 y 100 días del nuevo plazo.
      const oldMetadata = currentActa.metadata as Record<string, any>;
      const newMetadataRecord = metadata as Record<string, any>;

      const oldFecha = oldMetadata?.fechaSuscripcion as string | undefined;
      const newFecha = newMetadataRecord?.fechaSuscripcion as
        | string
        | undefined;

      // Si hay una nueva fecha y es diferente a la anterior (o no había)
      if (newFecha && newFecha !== oldFecha) {
        // Reiniciar notificaciones (se usa DbNull para limpiar campo JSON)
        dataToUpdate.notificationsSent = Prisma.DbNull;
      }
      // -------------------------------------------------

      dataToUpdate.metadata = newMetadata;

      const isCompleted = this.checkMetadataCompletion(newMetadata);
      dataToUpdate.isCompleted = isCompleted;

      // Si se completa y su estado previo era GUARDADA, la pasamos a COMPLETADA
      if (isCompleted && currentActa.status === ActaStatus.GUARDADA) {
        dataToUpdate.status = ActaStatus.COMPLETADA;
      }
    }

    return this.prisma.acta.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async remove(id: string, user: User) {
    await this.findOneForUser(id, user);
    return this.prisma.acta.delete({
      where: { id },
    });
  }

  async updateStatus(actaId: string, status: ActaStatus) {
    return this.prisma.acta.update({
      where: { id: actaId },
      data: { status: status },
    });
  }

  // MÉTODO PARA ENTREGAR ACTA (BLOQUEAR)
  async entregarActa(id: string, user: User) {
    const acta = await this.findOneForUser(id, user);

    if (acta.status === ActaStatus.ENTREGADA) {
      // Ya estaba entregada, no hacemos nada o lanzamos error (opcional)
      return acta;
    }

    return this.prisma.acta.update({
      where: { id },
      data: { status: ActaStatus.ENTREGADA },
    });
  }

  private checkActaOwnership(acta: Acta, userId: string) {
    if (acta.userId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para acceder a esta acta',
      );
    }
  }

  // --- LÓGICA DE DÍAS HÁBILES ---

  /**
   * Calcula la fecha límite sumando días hábiles (L-V) a una fecha de inicio.
   */
  private addBusinessDays(startDate: Date, days: number): Date {
    const currentDate = new Date(startDate);
    let addedDays = 0;

    while (addedDays < days) {
      currentDate.setDate(currentDate.getDate() + 1);
      const dayOfWeek = currentDate.getDay(); // 0 = Domingo, 6 = Sábado
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        addedDays++;
      }
    }
    return currentDate;
  }

  /**
   * Calcula cuántos días hábiles faltan entre hoy y la fecha límite.
   * Devuelve negativo si está vencido.
   * BASE: fechaSuscripcion (metadata) o createdAt.
   */
  public calculateBusinessDaysRemaining(
    // Hice público para tests si fuera necesario
    acta: { createdAt: Date; metadata: unknown },
    durationInDays: number,
  ): number {
    if (durationInDays <= 0) return 0;

    let startDate = new Date(acta.createdAt);

    if (
      typeof acta.metadata === 'object' &&
      acta.metadata !== null &&
      'fechaSuscripcion' in acta.metadata
    ) {
      const metadata = acta.metadata as { fechaSuscripcion?: string };
      if (metadata.fechaSuscripcion) {
        const fechaSuscripcion = new Date(metadata.fechaSuscripcion);
        if (!isNaN(fechaSuscripcion.getTime())) {
          startDate = fechaSuscripcion;
        }
      }
    }

    const deadline = this.addBusinessDays(startDate, durationInDays);
    const today = new Date();

    // Normalizar fechas para ignorar horas (comparar solo la fecha calendario)
    deadline.setHours(23, 59, 59, 999);
    today.setHours(0, 0, 0, 0);

    let daysRemaining = 0;
    const current = new Date(today);

    // Si hoy es igual al deadline, quedan 0 días (vence hoy)
    if (current.getTime() > deadline.getTime()) {
      // Caso VENCIDO: Calcular días pasados (como negativo)
      // Nota: Implementación simple para indicar vencimiento.
      return -1;
    }

    // Caso NO VENCIDO: Contar hacia adelante
    while (current < deadline) {
      current.setDate(current.getDate() + 1);
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        daysRemaining++;
      }
    }

    return daysRemaining;
  }

  /**
   * Verifica si han pasado más de 4 días hábiles.
   * Prioridad: metadata.fechaSuscripcion -> createdAt
   */
  private checkIfLate(acta: { createdAt: Date; metadata?: any }): boolean {
    let startDate = new Date(acta.createdAt);

    // Intentar leer fechaSuscripcion de metadata
    const metadata = acta.metadata as Record<string, any>;
    if (
      metadata &&
      metadata.fechaSuscripcion &&
      typeof metadata.fechaSuscripcion === 'string'
    ) {
      const fechaSuscripcion = new Date(metadata.fechaSuscripcion);
      if (!isNaN(fechaSuscripcion.getTime())) {
        startDate = fechaSuscripcion;
      }
    }

    const deadline = this.addBusinessDays(startDate, 4);
    const today = new Date();

    // Comparar timestamps
    return today.getTime() > deadline.getTime();
  }
  // --- REPORTES ADMIN ---

  async getActasStats() {
    // 1. Total absolute de actas
    const totalActas = await this.prisma.acta.count();

    // 2. Agrupación por status
    const groupedStats = await this.prisma.acta.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    // 3. Inicializar todos los estados en 0 para asegurar estructura completa
    const statsByStatus: Record<ActaStatus, number> = {
      [ActaStatus.GUARDADA]: 0,
      [ActaStatus.COMPLETADA]: 0,
      [ActaStatus.ENTREGADA]: 0,
      [ActaStatus.DESCARGADA]: 0,
      [ActaStatus.ENVIADA]: 0,
    };

    // 4. Llenar con los datos reales de la BD
    groupedStats.forEach((group) => {
      if (statsByStatus[group.status] !== undefined) {
        statsByStatus[group.status] = group._count.status;
      }
    });

    // 5. Calcular métrica personalizada (GUARDADA + COMPLETADA + DESCARGADA)
    const totalActasActivas =
      statsByStatus[ActaStatus.GUARDADA] +
      statsByStatus[ActaStatus.COMPLETADA] +
      statsByStatus[ActaStatus.DESCARGADA];

    return {
      totalActas,
      totalActasActivas,
      statsByStatus,
    };
  }

  async getActaInfoForAdmin(id: string) {
    const acta = await this.prisma.acta.findUnique({
      where: { id },
    });

    if (!acta) {
      throw new NotFoundException('Acta no encontrada');
    }

    const metadata = acta.metadata as Record<string, any>;
    const email =
      (metadata.correo_electronico as string) ||
      (metadata.email as string) ||
      '';

    // Estructura común
    const baseInfo = {
      email,
    };

    if (
      acta.type === ActaType.SALIENTE_GRATIS ||
      acta.type === ActaType.SALIENTE_PAGA
    ) {
      return {
        ...baseInfo,
        nombreServidorSaliente:
          (metadata.nombreServidorSaliente as string) || '',
        designacionServidorSaliente:
          (metadata.designacionServidorSaliente as string) || '',
        nombreServidorRecibe: (metadata.nombreServidorRecibe as string) || '',
        designacionServidorRecibe:
          (metadata.designacionServidorRecibe as string) || '',
      };
    }

    // Para ENTRANTE y MAXIMA_AUTORIDAD el formato solicitado es similar
    return {
      ...baseInfo,
      nombreServidorEntrante: (metadata.nombreServidorEntrante as string) || '',
      designacionServidorEntrante:
        (metadata.designacionServidorEntrante as string) || '',
      nombreAuditor: (metadata.nombreAuditor as string) || '',
      profesionAuditor: (metadata.profesionAuditor as string) || '',
      nombreTestigo1: (metadata.nombreTestigo1 as string) || '',
      profesionTestigo1: (metadata.profesionTestigo1 as string) || '',
      nombreTestigo2: (metadata.nombreTestigo2 as string) || '',
      profesionTestigo2: (metadata.profesionTestigo2 as string) || '',
      nombreServidorSaliente: (metadata.nombreServidorSaliente as string) || '',
      designacionServidorSaliente:
        (metadata.designacionServidorSaliente as string) || '',
    };
  }
}
