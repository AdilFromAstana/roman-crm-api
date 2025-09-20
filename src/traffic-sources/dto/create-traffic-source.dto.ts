import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  Length,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTrafficSourceDto {
  @ApiProperty({
    example: 'INSTAGRAM',
    description: 'Уникальный код источника трафика',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  code: string;

  @ApiProperty({
    example: 'Instagram',
    description: 'Название источника трафика',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @ApiPropertyOptional({
    example: 'Реклама в Instagram',
    description: 'Описание источника',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 'instagram',
    description: 'Иконка источника',
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
    description: 'Активен ли источник',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
