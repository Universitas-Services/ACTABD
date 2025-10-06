// src/users/users.service.ts
import { UnauthorizedException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from '../auth/dto/update-user.dto';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { ChangePasswordDto } from '../auth/dto/change-password.dto';
import { DeleteAccountDto } from '../auth/dto/delete-account.dto'; // Importa el nuevo DTO
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async update(id: string, updateUserDto: UpdateUserDto) {
    // Llama a Prisma para actualizar el usuario en la base de datos
    const updatedUser = await this.prisma.user.update({
      where: { id: id }, // Busca al usuario por su ID
      data: updateUserDto, // Aplica los nuevos datos del DTO
    });

    // Usa el método estático para devolver el usuario actualizado sin la contraseña
    return JwtStrategy.excludePassword(updatedUser);
  }
  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.prisma.user.findUnique({ where: { id } });

    // --- 👇 AÑADE ESTA COMPROBACIÓN AQUÍ ---
    if (!user) {
      // Esto no debería pasar si el usuario está autenticado,
      // pero es una buena práctica de seguridad manejarlo.
      throw new UnauthorizedException('Usuario no encontrado.');
    }
    // -----------------------------------------

    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password, // Ahora TypeScript sabe que 'user' no es null aquí
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('La contraseña actual es incorrecta.');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id },
      data: { password: hashedNewPassword },
    });

    return { message: 'Contraseña actualizada exitosamente.' };
  }
  async delete(id: string, deleteAccountDto: DeleteAccountDto) {
    const { password } = deleteAccountDto;

    // 1. Busca al usuario completo para obtener su contraseña hasheada
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      // Esto es una salvaguarda, no debería ocurrir si el token es válido
      throw new UnauthorizedException('Usuario no encontrado.');
    }

    // 2. Compara la contraseña proporcionada con la de la BD
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('La contraseña es incorrecta.');
    }

    // 3. Si la contraseña es correcta, elimina al usuario
    await this.prisma.user.delete({ where: { id } });

    return { message: 'La cuenta ha sido eliminada permanentemente.' };
  }
}
