import { PartialType } from '@nestjs/mapped-types';
import { CreateTrafficSourceDto } from './create-traffic-source.dto';

export class UpdateTrafficSourceDto extends PartialType(
  CreateTrafficSourceDto,
) {}
