// customers/dto/create-customer.dto.ts
import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  Length,
  IsEmail,
  Matches,
  IsDateString,
  IsInt,
  Min,
  Max,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Алексей', description: 'Имя клиента' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  firstName: string;

  @ApiProperty({ example: 'Петров', description: 'Фамилия клиента' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  lastName: string;

  @ApiPropertyOptional({
    example: 'Сергеевич',
    description: 'Отчество клиента',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(1, 50)
  middleName?: string;

  @ApiPropertyOptional({
    example: '123456789012',
    description: 'ИИН клиента',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(12, 12)
  @Matches(/^\d{12}$/, { message: 'ИИН должен содержать 12 цифр' })
  iin?: string;

  @ApiPropertyOptional({
    example: '+77011234567',
    description: 'Телефон клиента',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Неверный формат телефона' })
  phone?: string;

  @ApiPropertyOptional({
    example: 'alexey.petrov@email.com',
    description: 'Email клиента',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  @Length(1, 100)
  email?: string;

  @ApiPropertyOptional({
    example: 'г. Алматы, ул. Абая, д. 10',
    description: 'Адрес клиента',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(1, 200)
  address?: string;

  @ApiPropertyOptional({
    example: '1990-05-15',
    description: 'Дата рождения',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  birthDate?: Date;

  @ApiPropertyOptional({
    example: 'INSTAGRAM',
    description: 'Код источника трафика',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(1, 50)
  trafficSourceCode?: string;

  @ApiPropertyOptional({
    example: 3,
    description: 'Уровень прогрева (1-5)',
    required: false,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  warmingLevel?: number;

  @ApiPropertyOptional({
    example: 'ACTIVE',
    description: 'Код статуса клиента',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(1, 50)
  customerStatusCode?: string;

  @ApiPropertyOptional({
    example: ['VIP', 'Повторный'],
    description: 'Теги клиента',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({
    example: 'Постоянный клиент, предпочитает SUV',
    description: 'Заметки о клиенте',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Активен ли клиент',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
