// src/actas/actas.service.ts

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActaDto } from '../auth/dto/create-acta.dto';
import { UpdateActaDto } from '../auth/dto/update-acta.dto';
import { User, Acta, ActaStatus, Prisma } from '@prisma/client'; // <-- Importa Prisma
import { ActaDocxService } from './acta-docx.service';
import { GetActasFilterDto } from './dto/get-actas-filter.dto';

@Injectable()
export class ActasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly actaDocxService: ActaDocxService,
  ) {}

  /**
   * CORRECCIÓN DE ERRORES (Línea 19 y 29):
   * - Eliminamos 'ciudad' y 'estado' de la desestructuración.
   * - Eliminamos 'ciudad' y 'estado' de la llamada a la base de datos.
   * - Añadimos la lógica de 'metadataCompleto' que copia los campos.
   */
  async create(createActaDto: CreateActaDto, user: User) {
    // 1. Extraemos SOLO los campos que existen en el DTO
    const { type, nombreEntidad, metadata } = createActaDto;

    // 2. Generamos el número de acta
    const numeroActa = await this.generarNumeroActa();

    // 3. Creamos el metadata completo (copiando los campos de nivel superior)
    const metadataCompleto = {
      ...metadata,
      nombreEntidad: nombreEntidad,
      nombreOrgano: nombreEntidad, // Como discutimos, se duplica
      numeroActa: numeroActa,
      type: type,
    };

    // 4. Creamos el acta en la base de datos
    const nuevaActa = await this.prisma.acta.create({
      data: {
        numeroActa: numeroActa,
        nombreEntidad: nombreEntidad,
        type: type,
        status: ActaStatus.GUARDADA, // Estatus por defecto
        userId: user.id,
        metadata: metadataCompleto,
        // (Ya no hay error en la línea 29 porque no pasamos 'ciudad')
      },
    });

    return nuevaActa;
  }

  // Función para generar el número de acta (ejemplo)
  private async generarNumeroActa(): Promise<string> {
    const count = await this.prisma.acta.count();
    // Ajusta el prefijo si lo deseas
    return `ACTA-${(count + 1).toString().padStart(4, '0')}`;
  }

  /**
   * CORRECCIÓN DE ERROR (Línea 79):
   * - Cambiamos 'fecha' por 'createdAt' para ordenar.
   * - Añadimos un 'select' para tu panel de administrativo.
   */
  async findAllForUser(user: User, filterDto: GetActasFilterDto) {
    const { search, status, type, page = 1, limit = 10 } = filterDto;

    // 1. Calcular paginación
    const skip = (page - 1) * limit;

    // 2. Construir el filtro "where" dinámicamente
    const where: Prisma.ActaWhereInput = {
      userId: user.id, // Siempre filtrar por el usuario actual
    };

    // Filtro por estatus
    if (status) {
      where.status = status;
    }

    // Filtro por tipo
    if (type) {
      where.type = type;
    }

    // Búsqueda flexible (Search)
    if (search) {
      where.OR = [
        {
          nombreEntidad: {
            contains: search,
            mode: 'insensitive', // Ignora mayúsculas/minúsculas (Postgres)
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

    // 3. Ejecutar dos consultas: una para contar y otra para traer datos
    // Usamos una transacción ($transaction) para que sea eficiente
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
          // No traemos metadata ni el usuario completo para hacer la lista ligera
        },
      }),
    ]);

    // 4. Retornar estructura paginada estándar
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

  // Encuentra un acta y verifica que el usuario sea el dueño
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

  /**
   * Lógica de Actualización Corregida
   */
  async update(id: string, updateActaDto: UpdateActaDto, user: User) {
    const currentActa = await this.findOneForUser(id, user); // Verifica propiedad

    const { nombreEntidad, type, metadata } = updateActaDto;

    // Inicia el objeto de datos para Prisma
    const dataToUpdate: Prisma.ActaUpdateInput = {};

    if (nombreEntidad) {
      dataToUpdate.nombreEntidad = nombreEntidad;
    }
    if (type) {
      dataToUpdate.type = type;
    }

    // Lógica para fusionar el metadata (si se actualiza)
    if (metadata || nombreEntidad) {
      const newMetadata = {
        ...(currentActa.metadata as Record<string, any>), // Empieza con lo antiguo
        ...(metadata || {}), // Fusiona los nuevos cambios de metadata
      };

      // Si 'nombreEntidad' cambió, actualízalo también dentro del metadata
      if (nombreEntidad) {
        newMetadata.nombreEntidad = nombreEntidad;
        newMetadata.nombreOrgano = nombreEntidad;
      }

      dataToUpdate.metadata = newMetadata;
    }

    return this.prisma.acta.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  // Elimina un acta
  async remove(id: string, user: User) {
    await this.findOneForUser(id, user); // Verifica propiedad
    return this.prisma.acta.delete({
      where: { id },
    });
  }

  // Actualiza solo el estatus (usado por el controlador)
  async updateStatus(actaId: string, status: ActaStatus) {
    return this.prisma.acta.update({
      where: { id: actaId },
      data: { status: status },
    });
  }

  // Helper para verificar propiedad
  private checkActaOwnership(acta: Acta, userId: string) {
    if (acta.userId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para acceder a esta acta',
      );
    }
  }
}
