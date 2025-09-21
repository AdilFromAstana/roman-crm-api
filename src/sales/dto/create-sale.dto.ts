// sales/dto/create-sale.dto.ts
import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSaleDto {
  @ApiProperty({
    example: '550e4d8c-9b1c-4c2d-8c3d-4e5f6a7b8c9d',
    description: 'ID загнанного автомобиля',
  })
  @IsUUID()
  @IsNotEmpty()
  bringCarId: string;

  @ApiProperty({
    example: '550e4d8c-9b1c-4c2d-8c3d-4e5f6a7b8c9e',
    description: 'ID клиента',
  })
  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({
    example: '550e4d8c-9b1c-4c2d-8c3d-4e5f6a7b8c9f',
    description: 'ID сотрудника-продавца',
  })
  @IsUUID()
  @IsNotEmpty()
  saleEmployeeId: string;

  @ApiProperty({
    example: '550e4d8c-9b1c-4c2d-8c3d-4e5f6a7b8c9a',
    description: 'ID сотрудника, загнавшего авто',
  })
  @IsUUID()
  @IsNotEmpty()
  bringEmployeeId: string;

  @ApiPropertyOptional({
    example: '550e4d8c-9b1c-4c2d-8c3d-4e5f6a7b8c9b',
    description: 'ID менеджера',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  managerEmployeeId?: string;

  @ApiProperty({
    example: 6000000,
    description: 'Цена продажи автомобиля клиенту',
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  salePrice: number;

  @ApiProperty({
    example: 5000000,
    description: 'Цена закупки автомобиля (из загона)',
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  purchasePrice: number;

  @ApiPropertyOptional({
    example: 400000,
    description: 'Бонус продавца (конкретная сумма)',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  saleEmployeeBonus?: number;

  @ApiPropertyOptional({
    example: 300000,
    description: 'Бонус загнавшего (конкретная сумма)',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  bringEmployeeBonus?: number;

  @ApiPropertyOptional({
    example: 300000,
    description: 'Бонус менеджера (конкретная сумма)',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  managerEmployeeBonus?: number;

  @ApiPropertyOptional({
    example: 1000000,
    description: 'Общая сумма бонусов сотрудников',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalBonuses?: number;

  @ApiProperty({ example: '2024-03-20T10:30:00Z', description: 'Дата продажи' })
  @IsDateString()
  @IsNotEmpty()
  saleDate: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Активна ли продажа',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
