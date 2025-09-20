import { IsString, IsBoolean, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBrandDto {
  @ApiProperty({ example: 'TOYOTA', description: 'Уникальный код марки' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  code: string;

  @ApiProperty({ example: 'Toyota', description: 'Название марки' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @ApiProperty({
    example: true,
    description: 'Активна ли марка',
    required: false,
  })
  @IsBoolean()
  isActive?: boolean;
}
