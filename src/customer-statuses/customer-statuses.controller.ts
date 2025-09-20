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
import { CustomerStatusesService } from './customer-statuses.service';
import { CreateCustomerStatusDto } from './dto/create-customer-status.dto';
import { UpdateCustomerStatusDto } from './dto/update-customer-status.dto';
import { CustomerStatus } from './entities/customer-status.entity';

@ApiTags('customer-statuses')
@Controller('customer-statuses')
export class CustomerStatusesController {
  constructor(
    private readonly customerStatusesService: CustomerStatusesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Создать новый статус клиента' })
  @ApiResponse({
    status: 201,
    description: 'Статус клиента успешно создан',
    type: CustomerStatus,
  })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  create(@Body() createCustomerStatusDto: CreateCustomerStatusDto) {
    return this.customerStatusesService.create(createCustomerStatusDto);
  }

  @Post('seed-default')
  @ApiOperation({ summary: 'Создать стандартные статусы клиентов' })
  @ApiResponse({
    status: 201,
    description: 'Стандартные статусы созданы',
    type: [CustomerStatus],
  })
  seedDefault() {
    return this.customerStatusesService.createDefaultStatuses();
  }

  @Get()
  @ApiOperation({ summary: 'Получить все статусы клиентов' })
  @ApiResponse({
    status: 200,
    description: 'Список статусов клиентов',
    type: [CustomerStatus],
  })
  findAll() {
    return this.customerStatusesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить статус клиента по ID' })
  @ApiResponse({
    status: 200,
    description: 'Статус клиента найден',
    type: CustomerStatus,
  })
  @ApiResponse({ status: 404, description: 'Статус клиента не найден' })
  findOne(@Param('id') id: string) {
    return this.customerStatusesService.findOne(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Получить статус клиента по коду' })
  @ApiResponse({
    status: 200,
    description: 'Статус клиента найден',
    type: CustomerStatus,
  })
  @ApiResponse({ status: 404, description: 'Статус клиента не найден' })
  findOneByCode(@Param('code') code: string) {
    return this.customerStatusesService.findOneByCode(code);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить статус клиента' })
  @ApiResponse({
    status: 200,
    description: 'Статус клиента обновлен',
    type: CustomerStatus,
  })
  @ApiResponse({ status: 404, description: 'Статус клиента не найден' })
  update(
    @Param('id') id: string,
    @Body() updateCustomerStatusDto: UpdateCustomerStatusDto,
  ) {
    return this.customerStatusesService.update(id, updateCustomerStatusDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить статус клиента' })
  @ApiResponse({ status: 204, description: 'Статус клиента удален' })
  @ApiResponse({ status: 404, description: 'Статус клиента не найден' })
  remove(@Param('id') id: string) {
    return this.customerStatusesService.remove(id);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Переключить статус активности статуса клиента' })
  @ApiResponse({
    status: 200,
    description: 'Статус изменен',
    type: CustomerStatus,
  })
  @ApiResponse({ status: 404, description: 'Статус клиента не найден' })
  toggleActive(@Param('id') id: string) {
    return this.customerStatusesService.toggleActive(id);
  }
}
