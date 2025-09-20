import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerInteractionDto } from './create-customer-interaction.dto';

export class UpdateCustomerInteractionDto extends PartialType(
  CreateCustomerInteractionDto,
) {}
