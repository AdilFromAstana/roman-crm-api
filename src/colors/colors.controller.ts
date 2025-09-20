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
import { ColorsService } from './colors.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { Color } from './entities/color.entity';

@ApiTags('colors')
@Controller('colors')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новый цвет' })
  @ApiResponse({ status: 201, description: 'Цвет успешно создан', type: Color })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  create(@Body() createColorDto: CreateColorDto) {
    return this.colorsService.create(createColorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все цвета' })
  @ApiResponse({ status: 200, description: 'Список цветов', type: [Color] })
  findAll() {
    return this.colorsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить цвет по ID' })
  @ApiResponse({ status: 200, description: 'Цвет найден', type: Color })
  @ApiResponse({ status: 404, description: 'Цвет не найден' })
  findOne(@Param('id') id: string) {
    return this.colorsService.findOne(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Получить цвет по коду' })
  @ApiResponse({ status: 200, description: 'Цвет найден', type: Color })
  @ApiResponse({ status: 404, description: 'Цвет не найден' })
  findOneByCode(@Param('code') code: string) {
    return this.colorsService.findOneByCode(code);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить цвет' })
  @ApiResponse({ status: 200, description: 'Цвет обновлен', type: Color })
  @ApiResponse({ status: 404, description: 'Цвет не найден' })
  update(@Param('id') id: string, @Body() updateColorDto: UpdateColorDto) {
    return this.colorsService.update(id, updateColorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить цвет' })
  @ApiResponse({ status: 204, description: 'Цвет удален' })
  @ApiResponse({ status: 404, description: 'Цвет не найден' })
  remove(@Param('id') id: string) {
    return this.colorsService.remove(id);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Переключить статус активности цвета' })
  @ApiResponse({ status: 200, description: 'Статус изменен', type: Color })
  @ApiResponse({ status: 404, description: 'Цвет не найден' })
  toggleActive(@Param('id') id: string) {
    return this.colorsService.toggleActive(id);
  }
}
