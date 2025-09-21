// bring-car-statuses/dto/update-bring-car-status.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateBringCarStatusDto } from './create-bring-car-status.dto';

export class UpdateBringCarStatusDto extends PartialType(
  CreateBringCarStatusDto,
) {}
