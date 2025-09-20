import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsNumber,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateEmployeeIncomeDto {
  @ApiProperty({
    example: '550e4d8c-9b1c-4c2d-8c3d-4e5f6a7b8c9d',
    description: 'ID сотрудника',
  })
  @IsUUID()
  @IsNotEmpty()
  employeeId: string;

  @ApiPropertyOptional({
    example: '550e4d8c-9b1c-4c2d-8c3d-4e5f6a7b8c9e',
    description: 'ID продажи',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  saleId?: string;

  @ApiProperty({ example: 50000, description: 'Сумма дохода' })
  @IsNumber()
  @IsNotEmpty()
  incomeAmount: number;

  @ApiProperty({
    example: 'SALE_BONUS',
    description: 'Тип дохода',
    enum: ['SALE_BONUS', 'COMMISSION', 'OTHER'],
  })
  @IsEnum(['SALE_BONUS', 'COMMISSION', 'OTHER'])
  @IsNotEmpty()
  incomeType: 'SALE_BONUS' | 'COMMISSION' | 'OTHER';

  @ApiPropertyOptional({
    example: 'Бонус за продажу Toyota Camry',
    description: 'Описание',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Выплачено ли',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isPaid?: boolean;

  @ApiPropertyOptional({
    example: '2024-03-20T10:30:00Z',
    description: 'Дата выплаты',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  @Type(() => Date)
  paidDate?: Date;
}
