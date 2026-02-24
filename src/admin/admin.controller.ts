// src/admin/admin.controller.ts
import {
  Controller,
  Get, // <-- Import Get
  Patch,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Param, // <-- Import Param
  Query, // <-- Import Query
  Post,
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
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { BulkDeleteUsersDto } from './dto/bulk-delete.dto';
// Importa DTOs de Actas y Compliance
import { GetActasFilterDto } from '../actas/dto/get-actas-filter.dto';
import { GetComplianceFilterDto } from '../acta-compliance/dto/get-compliance-filter.dto';
// Importa Servicios
import { ActasService } from '../actas/actas.service';
import { ActaComplianceService } from '../acta-compliance/acta-compliance.service';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly actasService: ActasService,
    private readonly actaComplianceService: ActaComplianceService,
  ) {}

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

  @Patch('users/:id/upgrade-to-pro')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ascender un usuario a PRO (Gratis -> Pro)' })
  @ApiResponse({
    status: 200,
    description: 'Usuario ascendido a PRO exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  upgradeToPro(@Param('id') id: string) {
    return this.adminService.upgradeUserToPro(id);
  }

  @Get('users')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener lista de todos los usuarios (con filtros y paginación)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios recuperada exitosamente.',
  })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  findAllUsers(@Query() query: GetUsersQueryDto) {
    return this.adminService.findAllUsers(query);
  }

  @Get('users/:id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener detalles completos de un usuario (Solo Admin)',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles del usuario recuperados exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  findOneUser(@Param('id') id: string) {
    return this.adminService.findOneUser(id);
  }

  @Post('users/bulk-delete')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Eliminar (desactivar) masivamente usuarios por su ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuarios desactivados correctamente.',
  })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  bulkDeleteUsers(@Body() bulkDeleteUsersDto: BulkDeleteUsersDto) {
    return this.adminService.bulkDeleteUsers(bulkDeleteUsersDto.userIds);
  }

  // --- NUEVOS ENDPOINTS DE ESTADÍSTICAS POR USUARIO ---

  @Get('users/:userId/actas')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Obtener historial de Actas de un usuario específico',
  })
  findActasByUser(
    @Param('userId') userId: string,
    @Query() filterDto: GetActasFilterDto,
  ) {
    // Forzamos el userId en el filtro
    return this.actasService.findAll({ ...filterDto, userId });
  }

  @Get('users/:userId/actas-compliance')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Obtener historial de Compliance de un usuario específico',
  })
  findComplianceByUser(
    @Param('userId') userId: string,
    @Query() filterDto: GetComplianceFilterDto,
  ) {
    // Forzamos el userId en el filtro
    return this.actaComplianceService.findAll({ ...filterDto, userId });
  }
}
