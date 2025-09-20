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
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';

@ApiTags('employees')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @ApiOperation({ summary: 'Создать нового сотрудника' })
  @ApiResponse({
    status: 201,
    description: 'Сотрудник успешно создан',
    type: Employee,
  })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить всех сотрудников' })
  @ApiResponse({
    status: 200,
    description: 'Список сотрудников',
    type: [Employee],
  })
  findAll() {
    return this.employeesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить сотрудника по ID' })
  @ApiResponse({ status: 200, description: 'Сотрудник найден', type: Employee })
  @ApiResponse({ status: 404, description: 'Сотрудник не найден' })
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить сотрудника' })
  @ApiResponse({
    status: 200,
    description: 'Сотрудник обновлен',
    type: Employee,
  })
  @ApiResponse({ status: 404, description: 'Сотрудник не найден' })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить сотрудника' })
  @ApiResponse({ status: 204, description: 'Сотрудник удален' })
  @ApiResponse({ status: 404, description: 'Сотрудник не найден' })
  remove(@Param('id') id: string) {
    return this.employeesService.remove(id);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Переключить статус активности сотрудника' })
  @ApiResponse({ status: 200, description: 'Статус изменен', type: Employee })
  @ApiResponse({ status: 404, description: 'Сотрудник не найден' })
  toggleActive(@Param('id') id: string) {
    return this.employeesService.toggleActive(id);
  }
}
