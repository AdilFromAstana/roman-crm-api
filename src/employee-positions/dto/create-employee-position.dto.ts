import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEmployeePositionDto {
  @ApiProperty({ example: 'MANAGER', description: 'Уникальный код позиции' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  code: string;

  @ApiProperty({ example: 'Менеджер', description: 'Название позиции' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @ApiPropertyOptional({
    example: 'Отвечает за управление продажами',
    description: 'Описание позиции',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Активна ли позиция',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
