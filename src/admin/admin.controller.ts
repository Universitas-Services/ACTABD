// src/admin/admin.controller.ts
import {
  Controller,
  Patch,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

// --- ¡IMPORTA EL DTO DESDE SU ARCHIVO! ---
import { UpdateUserRoleDto } from './dto/update-role.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Patch('users/role')
  @Roles(UserRole.ADMIN) // <-- Protegido solo para ADMINS
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar el rol de un usuario (Solo Admin)' })
  @ApiResponse({ status: 200, description: 'Rol actualizado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado (No eres Admin).' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  updateUserRole(@Body() updateUserRoleDto: UpdateUserRoleDto) {
    // <-- Usa el DTO importado
    const { userId, newRole } = updateUserRoleDto;
    return this.adminService.updateUserRole(userId, newRole);
  }
}
