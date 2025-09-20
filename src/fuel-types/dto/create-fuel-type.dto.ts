import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFuelTypeDto {
  @ApiProperty({
    example: 'PETROL',
    description: 'Уникальный код типа топлива',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  code: string;

  @ApiProperty({ example: 'Бензин', description: 'Название типа топлива' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Активен ли тип топлива',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
