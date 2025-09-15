// src/locations/dto/create-city.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCityDto {
  @ApiProperty({ example: 'Алматы', description: 'Название города' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Казахстан', description: 'Страна' })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiPropertyOptional({ example: 'ALA', description: 'Код города' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ example: 43.222, description: 'Широта' })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 76.8512, description: 'Долгота' })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ example: true, description: 'Активен' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
