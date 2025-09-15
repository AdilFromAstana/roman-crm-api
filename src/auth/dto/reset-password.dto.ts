// src/auth/dto/reset-password.dto.ts
import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456', description: 'Код подтверждения' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ example: 'newpassword123', description: 'Новый пароль' })
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
