import { PartialType } from '@nestjs/mapped-types';
import { CreateSalesStatusDto } from './create-sales-status.dto';

export class UpdateSalesStatusDto extends PartialType(CreateSalesStatusDto) {}
