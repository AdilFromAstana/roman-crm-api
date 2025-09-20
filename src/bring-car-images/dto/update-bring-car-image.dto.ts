import { PartialType } from '@nestjs/mapped-types';
import { CreateBringCarImageDto } from './create-bring-car-image.dto';

export class UpdateBringCarImageDto extends PartialType(
  CreateBringCarImageDto,
) {}
