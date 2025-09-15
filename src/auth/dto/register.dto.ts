// src/auth/dto/register.dto.ts
import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Пароль' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Иван', description: 'Имя' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Иванов', description: 'Фамилия' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: '+7 (701) 123-45-67', description: 'Телефон' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ example: 1, description: 'ID агентства' })
  @IsNotEmpty()
  agencyId: number;
}
