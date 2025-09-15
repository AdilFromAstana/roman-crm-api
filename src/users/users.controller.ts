// src/users/users.controller.ts
import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { GetUsersDto } from './dto/get-users.dto';
import { PaginatedUsersResponseDto } from './dto/user-response.dto';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Получение списка пользователей с фильтрацией и пагинацией',
  })
  @ApiResponse({
    status: 200,
    description: 'Список пользователей',
    type: PaginatedUsersResponseDto,
  })
  async findAll(@Query(ValidationPipe) query: GetUsersDto) {
    return this.usersService.findAll(query);
  }
}
