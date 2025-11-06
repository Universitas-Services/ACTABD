// src/admin/admin.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // <-- 1. Importa Prisma
import { UserRole } from '@prisma/client';

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
}
