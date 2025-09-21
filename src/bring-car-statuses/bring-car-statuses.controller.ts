// bring-car-statuses/bring-car-statuses.controller.ts
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
import { BringCarStatusesService } from './bring-car-statuses.service';
import { CreateBringCarStatusDto } from './dto/create-bring-car-status.dto';
import { UpdateBringCarStatusDto } from './dto/update-bring-car-status.dto';
import { BringCarStatus } from './entities/bring-car-status.entity';

@ApiTags('bring-car-statuses')
@Controller('bring-car-statuses')
export class BringCarStatusesController {
  constructor(
    private readonly bringCarStatusesService: BringCarStatusesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Создать новый статус загнанного автомобиля' })
  @ApiResponse({
    status: 201,
    description: 'Статус успешно создан',
    type: BringCarStatus,
  })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  create(@Body() createBringCarStatusDto: CreateBringCarStatusDto) {
    return this.bringCarStatusesService.create(createBringCarStatusDto);
  }

  @Post('seed-default')
  @ApiOperation({
    summary: 'Создать стандартные статусы загнанных автомобилей',
  })
  @ApiResponse({
    status: 201,
    description: 'Стандартные статусы созданы',
    type: [BringCarStatus],
  })
  seedDefault() {
    return this.bringCarStatusesService.createDefaultStatuses();
  }

  @Get()
  @ApiOperation({ summary: 'Получить все статусы загнанных автомобилей' })
  @ApiResponse({
    status: 200,
    description: 'Список статусов',
    type: [BringCarStatus],
  })
  findAll() {
    return this.bringCarStatusesService.findAll();
  }

  @Get(':code')
  @ApiOperation({ summary: 'Получить статус загнанного автомобиля по коду' })
  @ApiResponse({
    status: 200,
    description: 'Статус найден',
    type: BringCarStatus,
  })
  @ApiResponse({ status: 404, description: 'Статус не найден' })
  findOne(@Param('code') code: string) {
    return this.bringCarStatusesService.findOne(code);
  }

  @Patch(':code')
  @ApiOperation({ summary: 'Обновить статус загнанного автомобиля' })
  @ApiResponse({
    status: 200,
    description: 'Статус обновлен',
    type: BringCarStatus,
  })
  @ApiResponse({ status: 404, description: 'Статус не найден' })
  update(
    @Param('code') code: string,
    @Body() updateBringCarStatusDto: UpdateBringCarStatusDto,
  ) {
    return this.bringCarStatusesService.update(code, updateBringCarStatusDto);
  }

  @Delete(':code')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить статус загнанного автомобиля' })
  @ApiResponse({ status: 204, description: 'Статус удален' })
  @ApiResponse({ status: 404, description: 'Статус не найден' })
  remove(@Param('code') code: string) {
    return this.bringCarStatusesService.remove(code);
  }

  @Patch(':code/toggle-active')
  @ApiOperation({
    summary: 'Переключить статус активности статуса загнанного автомобиля',
  })
  @ApiResponse({
    status: 200,
    description: 'Статус изменен',
    type: BringCarStatus,
  })
  @ApiResponse({ status: 404, description: 'Статус не найден' })
  toggleActive(@Param('code') code: string) {
    return this.bringCarStatusesService.toggleActive(code);
  }
}
