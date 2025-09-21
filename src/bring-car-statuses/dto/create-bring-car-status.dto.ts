// bring-car-statuses/dto/create-bring-car-status.dto.ts
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

export class CreateBringCarStatusDto {
  @ApiProperty({ example: 'BRINGED', description: 'Уникальный код статуса' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  code: string;

  @ApiProperty({ example: 'Привезен', description: 'Название статуса' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @ApiPropertyOptional({
    example: 'Автомобиль привезен владельцем в салон',
    description: 'Описание статуса',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Активен ли статус',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: 1,
    description: 'Порядок отображения',
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  sortOrder?: number;
}
