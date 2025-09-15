// src/users/dto/get-users.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsInt,
  Min,
  IsString,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../../common/enums/user-role.enum';

export class GetUsersDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Номер страницы',
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'Количество элементов на странице',
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsInt()
  limit?: number = 10;

  @ApiPropertyOptional({
    example: 'ivan',
    description: 'Поиск по имени, фамилии, email',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Только активные пользователи',
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Только верифицированные пользователи',
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isVerified?: boolean;

  @ApiPropertyOptional({
    example: 'realtor',
    description: 'Фильтр по роли',
    enum: UserRole,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID агентства',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  agencyId?: number;

  @ApiPropertyOptional({
    example: 'firstName',
    description: 'Поле для сортировки (firstName, lastName, email, createdAt)',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    example: 'ASC',
    description: 'Направление сортировки',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsEnum({ ASC: 'ASC', DESC: 'DESC' })
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
