import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTransmissionDto {
  @ApiProperty({
    example: 'MANUAL',
    description: 'Уникальный код коробки передач',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  code: string;

  @ApiProperty({ example: 'Механика', description: 'Название коробки передач' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Активна ли коробка передач',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
