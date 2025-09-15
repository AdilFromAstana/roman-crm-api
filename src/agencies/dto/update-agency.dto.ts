// src/agencies/dto/update-agency.dto.ts
import { PartialType } from '@nestjs/swagger';
import { AgencyDto } from '../../auth/dto/register-agency.dto';

export class UpdateAgencyDto extends PartialType(AgencyDto) {
  instagram?: string;
  tiktok?: string;
}
