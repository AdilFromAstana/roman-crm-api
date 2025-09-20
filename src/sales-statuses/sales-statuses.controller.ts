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
import { SalesStatusesService } from './sales-statuses.service';
import { CreateSalesStatusDto } from './dto/create-sales-status.dto';
import { UpdateSalesStatusDto } from './dto/update-sales-status.dto';
import { SalesStatus } from './entities/sales-status.entity';

@ApiTags('sales-statuses')
@Controller('sales-statuses')
export class SalesStatusesController {
  constructor(private readonly salesStatusesService: SalesStatusesService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новый статус продаж' })
  @ApiResponse({
    status: 201,
    description: 'Статус продаж успешно создан',
    type: SalesStatus,
  })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  create(@Body() createSalesStatusDto: CreateSalesStatusDto) {
    return this.salesStatusesService.create(createSalesStatusDto);
  }

  @Post('seed-default')
  @ApiOperation({ summary: 'Создать стандартные статусы продаж' })
  @ApiResponse({
    status: 201,
    description: 'Стандартные статусы созданы',
    type: [SalesStatus],
  })
  seedDefault() {
    return this.salesStatusesService.createDefaultStatuses();
  }

  @Get()
  @ApiOperation({ summary: 'Получить все статусы продаж' })
  @ApiResponse({
    status: 200,
    description: 'Список статусов продаж',
    type: [SalesStatus],
  })
  findAll() {
    return this.salesStatusesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить статус продаж по ID' })
  @ApiResponse({
    status: 200,
    description: 'Статус продаж найден',
    type: SalesStatus,
  })
  @ApiResponse({ status: 404, description: 'Статус продаж не найден' })
  findOne(@Param('id') id: string) {
    return this.salesStatusesService.findOne(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Получить статус продаж по коду' })
  @ApiResponse({
    status: 200,
    description: 'Статус продаж найден',
    type: SalesStatus,
  })
  @ApiResponse({ status: 404, description: 'Статус продаж не найден' })
  findOneByCode(@Param('code') code: string) {
    return this.salesStatusesService.findOneByCode(code);
  }

  @Get('order/:order')
  @ApiOperation({ summary: 'Получить статус продаж по порядку' })
  @ApiResponse({
    status: 200,
    description: 'Статус продаж найден',
    type: SalesStatus,
  })
  @ApiResponse({ status: 404, description: 'Статус продаж не найден' })
  findByOrder(@Param('order') order: string) {
    return this.salesStatusesService.findByOrder(parseInt(order));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить статус продаж' })
  @ApiResponse({
    status: 200,
    description: 'Статус продаж обновлен',
    type: SalesStatus,
  })
  @ApiResponse({ status: 404, description: 'Статус продаж не найден' })
  update(
    @Param('id') id: string,
    @Body() updateSalesStatusDto: UpdateSalesStatusDto,
  ) {
    return this.salesStatusesService.update(id, updateSalesStatusDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить статус продаж' })
  @ApiResponse({ status: 204, description: 'Статус продаж удален' })
  @ApiResponse({ status: 404, description: 'Статус продаж не найден' })
  remove(@Param('id') id: string) {
    return this.salesStatusesService.remove(id);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Переключить статус активности статуса продаж' })
  @ApiResponse({
    status: 200,
    description: 'Статус изменен',
    type: SalesStatus,
  })
  @ApiResponse({ status: 404, description: 'Статус продаж не найден' })
  toggleActive(@Param('id') id: string) {
    return this.salesStatusesService.toggleActive(id);
  }
}
