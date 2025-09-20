import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsUUID,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBringCarImageDto {
  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'URL изображения',
  })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    example: '550e4d8c-9b1c-4c2d-8c3d-4e5f6a7b8c9d',
    description: 'ID автомобиля',
  })
  @IsUUID()
  @IsNotEmpty()
  bringCarId: string;

  @ApiPropertyOptional({
    example: 0,
    description: 'Порядок отображения',
    required: false,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Активно ли изображение',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
