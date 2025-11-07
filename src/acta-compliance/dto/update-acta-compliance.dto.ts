// src/acta-compliance/dto/update-acta-compliance.dto.ts
import { PartialType } from '@nestjs/swagger';
import { BaseActaComplianceDto } from './create-acta-compliance.dto';

export class UpdateActaComplianceDto extends PartialType(
  BaseActaComplianceDto,
) {}
