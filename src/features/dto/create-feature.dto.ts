import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFeatureDto {
  @ApiProperty({ example: 'AC', description: 'Уникальный код особенности' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  code: string;

  @ApiProperty({ example: 'Кондиционер', description: 'Название особенности' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Активна ли особенность',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
