// src/users/users.controller.ts

// 👇 Añade HttpStatus a esta línea

import { ChangePasswordDto } from '../auth/dto/change-password.dto'; // Importa el nuevo DTO
import {
  Controller,
  Get,
  UseGuards,
  Patch,
  Body,
  Post,
  Delete,
} from '@nestjs/common';
import { UpdateUserDto } from '../auth/dto/update-user.dto';
import { HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { User } from '@prisma/client';
import { DeleteAccountDto } from '../auth/dto/delete-account.dto'; // Importa el nuevo DTO
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Usuarios')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Obtener el perfil del usuario autenticado' })
  // Ahora ESLint sabrá que HttpStatus.OK es un número válido
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Devuelve los datos del perfil del usuario.',
  })
  // Y que HttpStatus.UNAUTHORIZED también lo es
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado (token inválido o no provisto).',
  })
  getProfile(@GetUser() user: User) {
    return user;
  }
  @Patch('profile')
  updateProfile(
    @GetUser() user: User, // Obtenemos el usuario autenticado del token
    @Body() updateUserDto: UpdateUserDto, // Obtenemos los datos a actualizar del body
  ) {
    return this.usersService.update(user.id, updateUserDto);
  }

  @Post('password/change')
  changePassword(
    @GetUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(user.id, changePasswordDto);
  }
  @Delete('me') // Usamos 'me' como convención para "el usuario actual"
  deleteAccount(
    @GetUser() user: User,
    @Body() deleteAccountDto: DeleteAccountDto,
  ) {
    return this.usersService.delete(user.id, deleteAccountDto);
  }
}
