// src/users/users.controller.ts

import {
  Controller,
  Get,
  UseGuards,
  Patch,
  Body,
  Post,
  Delete,
  HttpStatus, // Importa HttpStatus
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { User } from '@prisma/client';
import { UpdateUserDto } from '../auth/dto/update-user.dto';
import { ChangePasswordDto } from '../auth/dto/change-password.dto';
import { DeleteAccountDto } from '../auth/dto/delete-account.dto';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CompleteProfileDto } from '../auth/dto/complete-profile.dto';
@ApiTags('Usuarios') // Agrupa todos estos endpoints bajo la etiqueta "Usuarios"
@ApiBearerAuth() // Indica que todas las rutas aquí requieren autenticación Bearer (JWT)
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('my') // Se mapea a GET /users/my
  @ApiOperation({
    summary: 'Verificar sesión y obtener datos básicos del usuario',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Devuelve el email, nombre completo y rol del usuario autenticado.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  getMyProfile(@GetUser() user: User) {
    // El decorador @GetUser inyecta el usuario validado desde el token
    return {
      nombreCompleto: `${user.nombre} ${user.apellido || ''}`.trim(),
      email: user.email,
      role: user.role, // Es útil devolver el rol
    };
  }
  @Get('profile')
  @ApiOperation({ summary: 'Obtener el perfil del usuario autenticado' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Devuelve los datos del perfil del usuario.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  async getProfile(@GetUser() user: User) {
    // Llama al servicio para obtener el usuario con su perfil incluido
    const userWithProfile = await this.usersService.findOneById(user.id);
    return userWithProfile;
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Actualizar el perfil del usuario autenticado' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Perfil actualizado exitosamente.',
  })
  updateProfile(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user.id, updateUserDto);
  }

  @Post('password/change')
  @ApiOperation({ summary: 'Cambiar la contraseña del usuario' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Contraseña actualizada exitosamente.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'La contraseña actual es incorrecta.',
  })
  changePassword(
    @GetUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(user.id, changePasswordDto);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Eliminar la cuenta del usuario autenticado' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'La cuenta ha sido eliminada permanentemente.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'La contraseña es incorrecta.',
  })
  deleteAccount(
    @GetUser() user: User,
    @Body() deleteAccountDto: DeleteAccountDto,
  ) {
    return this.usersService.delete(user.id, deleteAccountDto);
  }
  @Post('complete-profile')
  @ApiOperation({
    summary: 'Completar el perfil inicial del usuario (institución, cargo)',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Perfil inicial completado exitosamente.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'El perfil inicial ya ha sido completado.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  completeProfile(
    @GetUser() user: User,
    @Body() completeProfileDto: CompleteProfileDto,
  ) {
    return this.usersService.completeProfile(user.id, completeProfileDto);
  }
}
