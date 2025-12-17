// src/admin/admin.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // <-- 1. Importa Prisma
import { UserRole, Prisma } from '@prisma/client';
import { GetUsersQueryDto } from './dto/get-users-query.dto';

@Injectable()
export class AdminService {
  // 2. Inyecta Prisma
  constructor(private prisma: PrismaService) {}

  // 3. Añade la lógica para cambiar el rol
  async updateUserRole(userId: string, newRole: UserRole) {
    // Verifica que el usuario exista
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado.`);
    }

    // Actualiza el rol del usuario
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    // Quitamos la contraseña antes de devolver
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = updatedUser;
    return result;
  }

  // 4. Método específico para ascender a PRO
  async upgradeUserToPro(userId: string) {
    return this.updateUserRole(userId, UserRole.PAID_USER);
  }

  // 5. Método para listar todos los usuarios
  // 5. Método para listar todos los usuarios (con paginación y filtros)
  async findAllUsers(query: GetUsersQueryDto) {
    const { page = 1, limit = 10, role, search } = query;
    const skip = (page - 1) * limit;

    // Construir el filtro dinámicamente
    const where: Prisma.UserWhereInput = {};

    if (role) {
      where.role = role;
    }

    if (search) {
      where.email = {
        contains: search,
        mode: 'insensitive', // Búsqueda sin distinguir mayúsculas/minúsculas
      };
    }

    // Ejecutar dos consultas: una para el conteo total y otra para los datos
    const [totalItems, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          nombre: true,
          apellido: true,
          role: true,
          telefono: true,
          isEmailVerified: true,
          isActive: true,
          profileCompleted: true,
          createdAt: true,
          updatedAt: true,
          // Excluimos password explícitamente al no seleccionarlo
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: users,
      meta: {
        totalItems,
        itemCount: users.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }

  // 6. Método para ver detalle completo de un usuario
  async findOneUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true, // Incluimos el perfil para ver todos los detalles
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }

    // Quitamos la contraseña
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  // 7. Método de eliminación masiva (Soft Delete)
  async bulkDeleteUsers(userIds: string[]) {
    // Actualizamos 'isActive: false' para todos los IDs de la lista
    const result = await this.prisma.user.updateMany({
      where: {
        id: {
          in: userIds,
        },
      },
      data: {
        isActive: false,
      },
    });

    return {
      message: 'Proceso de eliminación masiva completado.',
      totalRequested: userIds.length,
      affectedCount: result.count,
    };
  }
}
