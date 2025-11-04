// src/actas/actas.service.ts

import {
  Injectable,
  NotFoundException, // <-- Añadir
  ForbiddenException, // <-- Añadir
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActaDto } from '../auth/dto/create-acta.dto';
import { UpdateActaDto } from '../auth/dto/update-acta.dto'; // <-- Importar DTO
import { User } from '@prisma/client';

@Injectable()
export class ActasService {
  constructor(private prisma: PrismaService) {}

  // ... (Tu método create() existente va aquí) ...
  async create(createActaDto: CreateActaDto, user: User) {
    const { type, nombreEntidad, ciudad, estado, metadata } = createActaDto;

    // Lógica para generar un número de acta único (puedes mejorarla según tus necesidades)
    const numeroActa = `${type}-${Date.now()}`;

    const nuevaActa = await this.prisma.acta.create({
      data: {
        numeroActa,
        type,
        nombreEntidad,
        ciudad,
        estado,
        fecha: new Date(), // Asignamos la fecha actual
        metadata: metadata || {}, // Asignamos el objeto de metadata o un objeto vacío
        // Conectamos el acta con el usuario que la está creando
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return nuevaActa;
  }

  /**
   * Método privado para verificar que un acta existe y pertenece al usuario.
   */
  private async checkActaOwnership(id: string, user: User) {
    const acta = await this.prisma.acta.findUnique({
      where: { id },
    });

    if (!acta) {
      throw new NotFoundException(`El acta con ID "${id}" no existe.`);
    }

    // Comprobamos que el acta pertenezca al usuario que hace la petición
    if (acta.userId !== user.id) {
      throw new ForbiddenException(
        'No tienes permiso para acceder a esta acta.',
      );
    }

    return acta;
  }

  // --- NUEVOS MÉTODOS CRUD ---

  /**
   * CONSULTAR TODAS (Read All)
   * Busca todas las actas que pertenecen al usuario autenticado.
   */
  async findAllForUser(user: User) {
    return this.prisma.acta.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        fecha: 'desc', // Ordenar por fecha descendente
      },
    });
  }

  /**
   * CONSULTAR UNA (Read One)
   * Busca un acta específica por ID, asegurando que pertenezca al usuario.
   */
  async findOneForUser(id: string, user: User) {
    // Usamos el helper para verificar propiedad y existencia
    return this.checkActaOwnership(id, user);
  }

  /**
   * ACTUALIZAR (Update)
   * Actualiza un acta específica por ID, asegurando que pertenezca al usuario.
   */
  async update(id: string, updateActaDto: UpdateActaDto, user: User) {
    // Verifica que el acta exista y pertenezca al usuario antes de actualizar
    await this.checkActaOwnership(id, user);

    return this.prisma.acta.update({
      where: { id },
      data: updateActaDto,
    });
  }

  /**
   * ELIMINAR (Delete)
   * Elimina un acta específica por ID, asegurando que pertenezca al usuario.
   */
  async remove(id: string, user: User) {
    // Verifica que el acta exista y pertenezca al usuario antes de eliminar
    await this.checkActaOwnership(id, user);

    await this.prisma.acta.delete({
      where: { id },
    });

    return { message: `Acta con ID "${id}" eliminada exitosamente.` };
  }
}
