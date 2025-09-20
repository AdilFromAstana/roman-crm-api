import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerStatusDto } from './create-customer-status.dto';

export class UpdateCustomerStatusDto extends PartialType(
  CreateCustomerStatusDto,
) {}
