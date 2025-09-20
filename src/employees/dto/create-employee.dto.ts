// employees/dto/create-employee.dto.ts
import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  Length,
  IsArray,
  IsEmail,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'Иван', description: 'Имя сотрудника' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  firstName: string;

  @ApiProperty({ example: 'Иванов', description: 'Фамилия сотрудника' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  lastName: string;

  @ApiPropertyOptional({
    example: '+77011234567',
    description: 'Телефон',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Неверный формат телефона' })
  phone?: string;

  @ApiPropertyOptional({
    example: 'ivan.ivanov@company.com',
    description: 'Email',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  @Length(1, 100)
  email?: string;

  @ApiPropertyOptional({
    example: ['MANAGER', 'SALESMAN'],
    description: 'Коды позиций сотрудника',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  positionCodes?: string[];

  @ApiPropertyOptional({
    example: true,
    description: 'Активен ли сотрудник',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
