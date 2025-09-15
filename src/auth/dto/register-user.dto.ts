// src/auth/dto/register-user.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsArray,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../common/enums/user-role.enum';

export class RegisterUserDto {
  @ApiProperty({
    example: 'realtor@topreal.kz',
    description: 'Email пользователя',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Пароль пользователя' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Иванов', description: 'Фамилия пользователя' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'Иванович',
    description: 'Отчество пользователя',
    required: false,
  })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty({
    example: '+7 (702) 123-45-67',
    description: 'Телефон пользователя',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ example: 1, description: 'ID агентства' })
  @IsNotEmpty()
  agencyId: number;

  @ApiProperty({
    example: [UserRole.REALTOR],
    description: 'Роли пользователя',
    enum: UserRole,
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  roles: UserRole[];

  @ApiProperty({
    example: 'RL-123456',
    description: 'Номер лицензии (для риэлторов)',
    required: false,
  })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiProperty({
    example: '2025-12-31',
    description: 'Срок действия лицензии',
    required: false,
  })
  @IsOptional()
  licenseExpiry?: Date;
}
