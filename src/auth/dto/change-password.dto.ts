// src/auth/dto/change-password.dto.ts
import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldpassword123', description: 'Текущий пароль' })
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ example: 'newpassword123', description: 'Новый пароль' })
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
