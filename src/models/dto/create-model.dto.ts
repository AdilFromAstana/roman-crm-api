import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsUUID,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateModelDto {
  @ApiProperty({ example: 'CAMRY', description: 'Уникальный код модели' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  code: string;

  @ApiProperty({ example: 'Camry', description: 'Название модели' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @ApiProperty({
    example: '550e4d8c-9b1c-4c2d-8c3d-4e5f6a7b8c9d',
    description: 'ID марки',
  })
  @IsUUID()
  @IsNotEmpty()
  brandId: string;

  @ApiProperty({
    example: true,
    description: 'Активна ли модель',
    required: false,
  })
  @IsBoolean()
  isActive?: boolean;
}
