// src/users/dto/user-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../common/enums/user-role.enum';

class RoleDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'admin' })
  name: string;

  @ApiProperty({ example: 'Главный администратор системы', required: false })
  description: string;
}

class AgencyDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Топ Риэлт' })
  name: string;

  @ApiProperty({ example: 'info@topreal.kz' })
  email: string;
}

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'Иван' })
  firstName: string;

  @ApiProperty({ example: 'Иванов' })
  lastName: string;

  @ApiProperty({ example: 'Иванович', required: false })
  middleName: string;

  @ApiProperty({ example: '+7 (701) 123-45-67' })
  phone: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
  avatar: string;

  @ApiProperty({ type: [RoleDto] })
  roles: RoleDto[];

  @ApiProperty({ type: AgencyDto, nullable: true })
  agency: AgencyDto;

  @ApiProperty({ example: 'RL-123456', required: false })
  licenseNumber: string;

  @ApiProperty({ example: '2025-12-31T00:00:00.000Z', required: false })
  licenseExpiry: Date;

  @ApiProperty({ example: false })
  isLicensed: boolean;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: false })
  isVerified: boolean;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

export class PaginatedUsersResponseDto {
  @ApiProperty({ type: [UserResponseDto] })
  data: UserResponseDto[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 10 })
  totalPages: number;
}
