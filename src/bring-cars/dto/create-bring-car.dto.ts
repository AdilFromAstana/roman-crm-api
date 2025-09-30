// bring-cars/dto/create-bring-car.dto.ts
import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsUUID,
  IsArray,
  IsNumber,
  Min,
  Max,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBringCarDto {
  // Автомобильные данные
  @ApiProperty({ example: 'TOYOTA', description: 'Код марки' })
  @IsString()
  @IsNotEmpty()
  brandCode: string;

  @ApiProperty({ example: 'CAMRY', description: 'Код модели' })
  @IsString()
  @IsNotEmpty()
  modelCode: string;

  @ApiProperty({ example: 2020, description: 'Год выпуска' })
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  @IsNotEmpty()
  year: number;

  @ApiProperty({ example: 5000000, description: 'Цена загона в тенге' })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  price: number;

  @ApiPropertyOptional({
    example: 6000000,
    description: 'Цена продажи в тенге',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  salePrice?: number;

  @ApiProperty({ example: 50000, description: 'Пробег в км' })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  mileage: number;

  @ApiProperty({ example: 'WHITE', description: 'Код цвета' })
  @IsString()
  @IsNotEmpty()
  colorCode: string;

  @ApiProperty({ example: 'PETROL', description: 'Код типа топлива' })
  @IsString()
  @IsNotEmpty()
  fuelTypeCode: string;

  @ApiProperty({ example: 'AUTOMATIC', description: 'Код коробки передач' })
  @IsString()
  @IsNotEmpty()
  transmissionCode: string;

  // Особенности
  @ApiPropertyOptional({
    example: ['AC', 'LEATHER'],
    description: 'Коды особенностей',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  featureCodes?: string[];

  // Описание
  @ApiPropertyOptional({
    example: 'Отличное состояние, один владелец',
    description: 'Описание',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  // Сотрудник и дата загона
  @ApiProperty({
    example: '550e4d8c-9b1c-4c2d-8c3d-4e5f6a7b8c9c',
    description: 'ID сотрудника, загнавшего авто',
  })
  @IsUUID()
  @IsNotEmpty()
  bringEmployeeId: string;

  @ApiProperty({ example: 'Загнали', description: 'Статус загона машины' })
  @IsNotEmpty()
  @IsString()
  bringCarStatusCode: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Дата загона' })
  @IsNotEmpty()
  @Type(() => Date)
  createdAt: Date;

  // Изображения
  @ApiPropertyOptional({
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    description: 'URL изображений',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageUrls?: string[];

  // Статус
  @ApiPropertyOptional({
    example: true,
    description: 'Активен ли автомобиль',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
