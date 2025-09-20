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

export class CreateCustomerStatusDto {
  @ApiProperty({
    example: 'UNWANTED',
    description: 'Уникальный код статуса клиента',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  code: string;

  @ApiProperty({
    example: 'Нежелательный клиент',
    description: 'Название статуса клиента',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @ApiPropertyOptional({
    example: 'Клиент проявляет агрессивное поведение',
    description: 'Описание статуса',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: '#FF0000',
    description: 'Цвет тега (HEX)',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'Неверный формат HEX кода',
  })
  color?: string;

  @ApiPropertyOptional({
    example: 'alert',
    description: 'Иконка статуса',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(1, 50)
  icon?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Порядок отображения',
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  sortOrder?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Активен ли статус',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
