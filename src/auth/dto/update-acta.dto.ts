// src/auth/dto/update-acta.dto.ts

import { PartialType } from '@nestjs/swagger';
import { CreateActaDto } from './create-acta.dto';

export class UpdateActaDto extends PartialType(CreateActaDto) {}
