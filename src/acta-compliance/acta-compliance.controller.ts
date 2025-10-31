// src/acta-compliance/acta-compliance.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { ActaComplianceService } from './acta-compliance.service';
import { CreateActaComplianceDto } from './dto/create-acta-compliance.dto';
import { UpdateActaComplianceDto } from './dto/update-acta-compliance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Importa el guardián
import { GetUser } from '../auth/decorators/get-user.decorator'; // Importa el decorador
import { User } from '@prisma/client'; // Importa el tipo User
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Acta Compliance')
@ApiBearerAuth() // Indica que todas las rutas aquí requieren autenticación
@UseGuards(JwtAuthGuard) // Protege todas las rutas de este controlador
@Controller('acta-compliance')
export class ActaComplianceController {
  constructor(private readonly actaComplianceService: ActaComplianceService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo checklist de cumplimiento' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Checklist creado exitosamente.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  create(
    @Body() createActaComplianceDto: CreateActaComplianceDto,
    @GetUser() user: User, // Obtiene el usuario autenticado del token
  ) {
    // Pasa el ID del usuario al servicio
    return this.actaComplianceService.create(createActaComplianceDto, user.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los checklists (Admin - considera restringir)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de todos los checklists.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  findAll() {
    // Advertencia: Esto devuelve TODOS los checklists.
    // En un futuro, podrías querer restringir esto solo para admins.
    return this.actaComplianceService.findAll();
  }

  @Get('my-checklists')
  @ApiOperation({
    summary: 'Obtener todos mis checklists de cumplimiento creados',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de los checklists del usuario.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  findAllForUser(@GetUser() user: User) {
    // Busca solo los checklists asociados al usuario autenticado
    return this.actaComplianceService.findAllForUser(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un checklist de cumplimiento por su ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del checklist (UUID)',
    type: String,
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Checklist encontrado.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Checklist no encontrado.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    // Opcional: Verificar que el usuario sea dueño del registro o admin
    // Para hacer esto, necesitarías recibir el usuario con @GetUser()
    // y añadir lógica de negocio en el servicio.
    const compliance = await this.actaComplianceService.findOne(id);
    return compliance;
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un checklist de cumplimiento por su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del checklist (UUID)',
    type: String,
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Checklist actualizado.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Checklist no encontrado.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateActaComplianceDto: UpdateActaComplianceDto,
    // @GetUser() user: User, // Opcional: verificar propiedad antes de actualizar
  ) {
    // Opcional: Verificar que el usuario sea dueño del registro
    // const compliance = await this.actaComplianceService.findOne(id);
    // if (compliance.userId !== user.id) {
    //   throw new ForbiddenException('No tienes permiso para editar este registro.');
    // }
    return this.actaComplianceService.update(id, updateActaComplianceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un checklist de cumplimiento por su ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del checklist (UUID)',
    type: String,
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Checklist eliminado.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Checklist no encontrado.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado.',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    // @GetUser() user: User, // Opcional: verificar propiedad antes de eliminar
  ) {
    // Opcional: Verificar propiedad
    // const compliance = await this.actaComplianceService.findOne(id);
    // if (compliance.userId !== user.id) {
    //   throw new ForbiddenException('No tienes permiso para eliminar este registro.');
    // }
    return this.actaComplianceService.remove(id);
  }
}
