// src/locations/dto/create-district.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDistrictDto {
  @ApiProperty({ example: 'Медеуский', description: 'Название района' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 43.2389, description: 'Широта' })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ example: 76.8877, description: 'Долгота' })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ example: true, description: 'Активен' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 1, description: 'ID города' })
  @IsNotEmpty()
  @IsNumber()
  cityId: number;
}
