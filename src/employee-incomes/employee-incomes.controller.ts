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
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { EmployeeIncomesService } from './employee-incomes.service';
import { CreateEmployeeIncomeDto } from './dto/create-employee-income.dto';
import { UpdateEmployeeIncomeDto } from './dto/update-employee-income.dto';
import { EmployeeIncome } from './entities/employee-income.entity';

@ApiTags('employee-incomes')
@Controller('employee-incomes')
export class EmployeeIncomesController {
  constructor(
    private readonly employeeIncomesService: EmployeeIncomesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Создать новую запись дохода сотрудника' })
  @ApiResponse({
    status: 201,
    description: 'Доход успешно создан',
    type: EmployeeIncome,
  })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  create(@Body() createEmployeeIncomeDto: CreateEmployeeIncomeDto) {
    return this.employeeIncomesService.create(createEmployeeIncomeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все доходы сотрудников' })
  @ApiResponse({
    status: 200,
    description: 'Список доходов',
    type: [EmployeeIncome],
  })
  @ApiQuery({
    name: 'employeeId',
    required: false,
    description: 'Фильтр по ID сотрудника',
  })
  @ApiQuery({
    name: 'saleId',
    required: false,
    description: 'Фильтр по ID продажи',
  })
  @ApiQuery({
    name: 'incomeType',
    required: false,
    description: 'Фильтр по типу дохода',
  })
  @ApiQuery({
    name: 'isPaid',
    required: false,
    description: 'Фильтр по статусу выплаты',
  })
  findAll(
    @Query('employeeId') employeeId?: string,
    @Query('saleId') saleId?: string,
    @Query('incomeType') incomeType?: string,
    @Query('isPaid') isPaid?: string,
  ) {
    if (employeeId) {
      return this.employeeIncomesService.findByEmployee(employeeId);
    }
    if (saleId) {
      return this.employeeIncomesService.findBySale(saleId);
    }
    if (incomeType) {
      return this.employeeIncomesService.findByType(incomeType as any);
    }
    if (isPaid !== undefined) {
      return this.employeeIncomesService.findByPaymentStatus(isPaid === 'true');
    }
    return this.employeeIncomesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить доход сотрудника по ID' })
  @ApiResponse({
    status: 200,
    description: 'Доход найден',
    type: EmployeeIncome,
  })
  @ApiResponse({ status: 404, description: 'Доход не найден' })
  findOne(@Param('id') id: string) {
    return this.employeeIncomesService.findOne(id);
  }

  @Get('employee/:employeeId')
  @ApiOperation({ summary: 'Получить доходы сотрудника' })
  @ApiResponse({
    status: 200,
    description: 'Список доходов сотрудника',
    type: [EmployeeIncome],
  })
  findByEmployee(@Param('employeeId') employeeId: string) {
    return this.employeeIncomesService.findByEmployee(employeeId);
  }

  @Get('sale/:saleId')
  @ApiOperation({ summary: 'Получить доходы по продаже' })
  @ApiResponse({
    status: 200,
    description: 'Список доходов по продаже',
    type: [EmployeeIncome],
  })
  findBySale(@Param('saleId') saleId: string) {
    return this.employeeIncomesService.findBySale(saleId);
  }

  @Get('stats/employee/:employeeId')
  @ApiOperation({ summary: 'Получить статистику доходов сотрудника' })
  @ApiResponse({ status: 200, description: 'Статистика доходов сотрудника' })
  getEmployeeStats(@Param('employeeId') employeeId: string) {
    return this.employeeIncomesService.getEmployeeIncomeStats(employeeId);
  }

  @Get('stats/company')
  @ApiOperation({ summary: 'Получить статистику доходов компании' })
  @ApiResponse({ status: 200, description: 'Статистика доходов компании' })
  getCompanyStats() {
    return this.employeeIncomesService.getCompanyIncomeStats();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить доход сотрудника' })
  @ApiResponse({
    status: 200,
    description: 'Доход обновлен',
    type: EmployeeIncome,
  })
  @ApiResponse({ status: 404, description: 'Доход не найден' })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  update(
    @Param('id') id: string,
    @Body() updateEmployeeIncomeDto: UpdateEmployeeIncomeDto,
  ) {
    return this.employeeIncomesService.update(id, updateEmployeeIncomeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить доход сотрудника' })
  @ApiResponse({ status: 204, description: 'Доход удален' })
  @ApiResponse({ status: 404, description: 'Доход не найден' })
  remove(@Param('id') id: string) {
    return this.employeeIncomesService.remove(id);
  }

  @Patch(':id/toggle-paid')
  @ApiOperation({ summary: 'Переключить статус выплаты дохода' })
  @ApiResponse({
    status: 200,
    description: 'Статус изменен',
    type: EmployeeIncome,
  })
  @ApiResponse({ status: 404, description: 'Доход не найден' })
  togglePaidStatus(@Param('id') id: string) {
    return this.employeeIncomesService.togglePaidStatus(id);
  }
}
