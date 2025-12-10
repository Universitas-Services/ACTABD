// src/actas/actas.service.ts

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActaDto } from '../auth/dto/create-acta.dto';
import { UpdateActaDto } from '../auth/dto/update-acta.dto';
import { User, Acta, ActaStatus, Prisma } from '@prisma/client';
import { ActaDocxService } from './acta-docx.service';
import { GetActasFilterDto } from './dto/get-actas-filter.dto';

@Injectable()
export class ActasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly actaDocxService: ActaDocxService,
  ) {}

  async create(createActaDto: CreateActaDto, user: User) {
    const { type, nombreEntidad, metadata } = createActaDto;

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
        status: ActaStatus.GUARDADA,
        userId: user.id,
        metadata: metadataCompleto,
        isCompleted: isCompleted,
      },
    });

    return nuevaActa;
  }

  // --- CAMBIO PRINCIPAL AQUÍ ---
  // Busca el último número existente en lugar de contar registros
  private async generarNumeroActa(): Promise<string> {
    // Busca el acta más reciente ordenando por fecha de creación
    const lastActa = await this.prisma.acta.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    let nextNumber = 1; // Valor inicial si la base de datos está vacía

    // Si ya existe un acta, extraemos su número y sumamos 1
    if (lastActa && lastActa.numeroActa) {
      // El formato es "ACTA-0001", hacemos split para obtener ["ACTA", "0001"]
      const parts = lastActa.numeroActa.split('-');
      if (parts.length === 2) {
        const lastSequence = parseInt(parts[1], 10);
        if (!isNaN(lastSequence)) {
          nextNumber = lastSequence + 1; // Aquí ocurre la magia: 5 + 1 = 6 (aunque solo hayan 4 registros)
        }
      }
    }

    // Formatea el nuevo número (ej: 6 se convierte en "ACTA-0006")
    return `ACTA-${nextNumber.toString().padStart(4, '0')}`;
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
        },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        limit,
      },
    };
  }

  async findOneForUser(id: string, user: User): Promise<Acta> {
    const acta = await this.prisma.acta.findUnique({
      where: { id },
    });

    if (!acta) {
      throw new NotFoundException('Acta no encontrada');
    }
    this.checkActaOwnership(acta, user.id);
    return acta;
  }

  async update(id: string, updateActaDto: UpdateActaDto, user: User) {
    const currentActa = await this.findOneForUser(id, user);

    const { nombreEntidad, type, metadata } = updateActaDto;

    const dataToUpdate: Prisma.ActaUpdateInput = {};

    if (nombreEntidad) {
      dataToUpdate.nombreEntidad = nombreEntidad;
    }
    if (type) {
      dataToUpdate.type = type;
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

      dataToUpdate.metadata = newMetadata;
      dataToUpdate.isCompleted = this.checkMetadataCompletion(newMetadata);
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

  private checkActaOwnership(acta: Acta, userId: string) {
    if (acta.userId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para acceder a esta acta',
      );
    }
  }
}
