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
import { FuelTypesService } from './fuel-types.service';
import { CreateFuelTypeDto } from './dto/create-fuel-type.dto';
import { UpdateFuelTypeDto } from './dto/update-fuel-type.dto';
import { FuelType } from './entities/fuel-type.entity';

@ApiTags('fuel-types')
@Controller('fuel-types')
export class FuelTypesController {
  constructor(private readonly fuelTypesService: FuelTypesService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новый тип топлива' })
  @ApiResponse({
    status: 201,
    description: 'Тип топлива успешно создан',
    type: FuelType,
  })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  create(@Body() createFuelTypeDto: CreateFuelTypeDto) {
    return this.fuelTypesService.create(createFuelTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все типы топлива' })
  @ApiResponse({
    status: 200,
    description: 'Список типов топлива',
    type: [FuelType],
  })
  findAll() {
    return this.fuelTypesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить тип топлива по ID' })
  @ApiResponse({
    status: 200,
    description: 'Тип топлива найден',
    type: FuelType,
  })
  @ApiResponse({ status: 404, description: 'Тип топлива не найден' })
  findOne(@Param('id') id: string) {
    return this.fuelTypesService.findOne(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Получить тип топлива по коду' })
  @ApiResponse({
    status: 200,
    description: 'Тип топлива найден',
    type: FuelType,
  })
  @ApiResponse({ status: 404, description: 'Тип топлива не найден' })
  findOneByCode(@Param('code') code: string) {
    return this.fuelTypesService.findOneByCode(code);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить тип топлива' })
  @ApiResponse({
    status: 200,
    description: 'Тип топлива обновлен',
    type: FuelType,
  })
  @ApiResponse({ status: 404, description: 'Тип топлива не найден' })
  update(
    @Param('id') id: string,
    @Body() updateFuelTypeDto: UpdateFuelTypeDto,
  ) {
    return this.fuelTypesService.update(id, updateFuelTypeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить тип топлива' })
  @ApiResponse({ status: 204, description: 'Тип топлива удален' })
  @ApiResponse({ status: 404, description: 'Тип топлива не найден' })
  remove(@Param('id') id: string) {
    return this.fuelTypesService.remove(id);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Переключить статус активности типа топлива' })
  @ApiResponse({ status: 200, description: 'Статус изменен', type: FuelType })
  @ApiResponse({ status: 404, description: 'Тип топлива не найден' })
  toggleActive(@Param('id') id: string) {
    return this.fuelTypesService.toggleActive(id);
  }
}
