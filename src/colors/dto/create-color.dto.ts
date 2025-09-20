import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateColorDto {
  @ApiProperty({ example: 'WHITE', description: 'Уникальный код цвета' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  code: string;

  @ApiProperty({ example: 'Белый', description: 'Название цвета' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @ApiPropertyOptional({
    example: '#FFFFFF',
    description: 'HEX код цвета',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'Неверный формат HEX кода',
  })
  hexCode?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Активен ли цвет',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
