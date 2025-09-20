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
import { TrafficSourcesService } from './traffic-sources.service';
import { CreateTrafficSourceDto } from './dto/create-traffic-source.dto';
import { UpdateTrafficSourceDto } from './dto/update-traffic-source.dto';
import { TrafficSource } from './entities/traffic-source.entity';

@ApiTags('traffic-sources')
@Controller('traffic-sources')
export class TrafficSourcesController {
  constructor(private readonly trafficSourcesService: TrafficSourcesService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новый источник трафика' })
  @ApiResponse({
    status: 201,
    description: 'Источник трафика успешно создан',
    type: TrafficSource,
  })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  create(@Body() createTrafficSourceDto: CreateTrafficSourceDto) {
    return this.trafficSourcesService.create(createTrafficSourceDto);
  }

  @Post('seed-default')
  @ApiOperation({ summary: 'Создать стандартные источники трафика' })
  @ApiResponse({
    status: 201,
    description: 'Стандартные источники созданы',
    type: [TrafficSource],
  })
  seedDefault() {
    return this.trafficSourcesService.createDefaultSources();
  }

  @Get()
  @ApiOperation({ summary: 'Получить все источники трафика' })
  @ApiResponse({
    status: 200,
    description: 'Список источников трафика',
    type: [TrafficSource],
  })
  findAll() {
    return this.trafficSourcesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить источник трафика по ID' })
  @ApiResponse({
    status: 200,
    description: 'Источник трафика найден',
    type: TrafficSource,
  })
  @ApiResponse({ status: 404, description: 'Источник трафика не найден' })
  findOne(@Param('id') id: string) {
    return this.trafficSourcesService.findOne(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Получить источник трафика по коду' })
  @ApiResponse({
    status: 200,
    description: 'Источник трафика найден',
    type: TrafficSource,
  })
  @ApiResponse({ status: 404, description: 'Источник трафика не найден' })
  findOneByCode(@Param('code') code: string) {
    return this.trafficSourcesService.findOneByCode(code);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить источник трафика' })
  @ApiResponse({
    status: 200,
    description: 'Источник трафика обновлен',
    type: TrafficSource,
  })
  @ApiResponse({ status: 404, description: 'Источник трафика не найден' })
  update(
    @Param('id') id: string,
    @Body() updateTrafficSourceDto: UpdateTrafficSourceDto,
  ) {
    return this.trafficSourcesService.update(id, updateTrafficSourceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить источник трафика' })
  @ApiResponse({ status: 204, description: 'Источник трафика удален' })
  @ApiResponse({ status: 404, description: 'Источник трафика не найден' })
  remove(@Param('id') id: string) {
    return this.trafficSourcesService.remove(id);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Переключить статус активности источника трафика' })
  @ApiResponse({
    status: 200,
    description: 'Статус изменен',
    type: TrafficSource,
  })
  @ApiResponse({ status: 404, description: 'Источник трафика не найден' })
  toggleActive(@Param('id') id: string) {
    return this.trafficSourcesService.toggleActive(id);
  }
}
