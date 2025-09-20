import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EmployeePositionsService } from './employee-positions.service';
import { CreateEmployeePositionDto } from './dto/create-employee-position.dto';
import { UpdateEmployeePositionDto } from './dto/update-employee-position.dto';
import { EmployeePosition } from './entities/employee-position.entity';

@ApiTags('employee-positions')
@Controller('employee-positions')
export class EmployeePositionsController {
  constructor(
    private readonly employeePositionsService: EmployeePositionsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Создать новую позицию сотрудника' })
  @ApiResponse({
    status: 201,
    description: 'Позиция успешно создана',
    type: EmployeePosition,
  })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  create(@Body() createEmployeePositionDto: CreateEmployeePositionDto) {
    return this.employeePositionsService.create(createEmployeePositionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все позиции сотрудников' })
  @ApiResponse({
    status: 200,
    description: 'Список позиций',
    type: [EmployeePosition],
  })
  findAll() {
    return this.employeePositionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить позицию сотрудника по ID' })
  @ApiResponse({
    status: 200,
    description: 'Позиция найдена',
    type: EmployeePosition,
  })
  @ApiResponse({ status: 404, description: 'Позиция не найдена' })
  findOne(@Param('id') id: string) {
    return this.employeePositionsService.findOne(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Получить позицию сотрудника по коду' })
  @ApiResponse({
    status: 200,
    description: 'Позиция найдена',
    type: EmployeePosition,
  })
  @ApiResponse({ status: 404, description: 'Позиция не найдена' })
  findOneByCode(@Param('code') code: string) {
    return this.employeePositionsService.findOneByCode(code);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить позицию сотрудника' })
  @ApiResponse({
    status: 200,
    description: 'Позиция обновлена',
    type: EmployeePosition,
  })
  @ApiResponse({ status: 404, description: 'Позиция не найдена' })
  update(
    @Param('id') id: string,
    @Body() updateEmployeePositionDto: UpdateEmployeePositionDto,
  ) {
    return this.employeePositionsService.update(id, updateEmployeePositionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить позицию сотрудника' })
  @ApiResponse({ status: 204, description: 'Позиция удалена' })
  @ApiResponse({ status: 404, description: 'Позиция не найдена' })
  remove(@Param('id') id: string) {
    return this.employeePositionsService.remove(id);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Переключить статус активности позиции' })
  @ApiResponse({
    status: 200,
    description: 'Статус изменен',
    type: EmployeePosition,
  })
  @ApiResponse({ status: 404, description: 'Позиция не найдена' })
  toggleActive(@Param('id') id: string) {
    return this.employeePositionsService.toggleActive(id);
  }
}
