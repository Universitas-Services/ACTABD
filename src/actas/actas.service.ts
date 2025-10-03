// src/actas/actas.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActaDto } from '../auth/dto/create-acta.dto';
import { User } from '@prisma/client';

@Injectable()
export class ActasService {
  constructor(private prisma: PrismaService) {}

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
}
