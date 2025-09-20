import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeIncomeDto } from './create-employee-income.dto';

export class UpdateEmployeeIncomeDto extends PartialType(
  CreateEmployeeIncomeDto,
) {}
