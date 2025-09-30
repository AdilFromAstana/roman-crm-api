import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  Length,
  IsUUID,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateCustomerInteractionDto {
  @ApiProperty({
    example: '550e4d8c-9b1c-4c2d-8c3d-4e5f6a7b8c9d',
    description: 'ID клиента',
  })
  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @ApiPropertyOptional({
    example: '550e4d8c-9b1c-4c2d-8c3d-4e5f6a7b8c9e',
    description: 'ID сотрудника',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  employeeId?: string;

  @ApiProperty({
    example: 'CALL',
    description: 'Тип взаимодействия',
    enum: ['CALL', 'WHATSAPP', 'VISIT', 'EMAIL', 'INTERNET_LEAD'],
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  type: string;

  @ApiProperty({
    example: 'Первый звонок клиенту',
    description: 'Заголовок взаимодействия',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  title: string;

  @ApiProperty({
    example: 'Позвонил клиенту по поводу Toyota Camry',
    description: 'Описание взаимодействия',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    example: 'Клиент заинтересован, назначена встреча',
    description: 'Результат взаимодействия',
    required: false,
  })
  @IsString()
  @IsOptional()
  result?: string;

  @ApiProperty({
    example: '2024-03-20T10:30:00Z',
    description: 'Дата и время взаимодействия',
  })
  @IsDateString()
  @IsNotEmpty()
  interactionDate: string;

  @ApiPropertyOptional({
    example: '2024-03-22T11:00:00Z',
    description: 'Дата следующего действия',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  nextActionDate?: string;

  @ApiPropertyOptional({
    example: 'Не забыть отправить КП',
    description: 'Заметки',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Активно ли взаимодействие',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
