import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  Length,
  IsInt,
  Min,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSalesStatusDto {
  @ApiProperty({
    example: 'ON_APPROVAL',
    description: 'Уникальный код статуса продаж',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  code: string;

  @ApiProperty({
    example: 'На одобрении',
    description: 'Название статуса продаж',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @ApiPropertyOptional({
    example: 'Клиент находится на стадии одобрения кредита',
    description: 'Описание статуса',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: '#2196F3',
    description: 'Цвет статуса (HEX)',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'Неверный формат HEX кода',
  })
  color?: string;

  @ApiPropertyOptional({
    example: 'approval',
    description: 'Иконка статуса',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(1, 50)
  icon?: string;

  @ApiProperty({ example: 1, description: 'Порядок в воронке продаж' })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  order: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Активен ли статус',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
