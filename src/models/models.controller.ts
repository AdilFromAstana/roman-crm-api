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
import { ModelsService } from './models.service';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { Model } from './entities/model.entity';

@ApiTags('models')
@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новую модель' })
  @ApiResponse({
    status: 201,
    description: 'Модель успешно создана',
    type: Model,
  })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  @ApiResponse({ status: 404, description: 'Марка не найдена' })
  create(@Body() createModelDto: CreateModelDto) {
    return this.modelsService.create(createModelDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все модели' })
  @ApiResponse({ status: 200, description: 'Список моделей', type: [Model] })
  @ApiQuery({
    name: 'brandId',
    required: false,
    description: 'Фильтр по ID марки',
  })
  findAll(@Query('brandId') brandId?: string) {
    if (brandId) {
      return this.modelsService.findByBrand(brandId);
    }
    return this.modelsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить модель по ID' })
  @ApiResponse({ status: 200, description: 'Модель найдена', type: Model })
  @ApiResponse({ status: 404, description: 'Модель не найдена' })
  findOne(@Param('id') id: string) {
    return this.modelsService.findOne(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Получить модель по коду' })
  @ApiResponse({ status: 200, description: 'Модель найдена', type: Model })
  @ApiResponse({ status: 404, description: 'Модель не найдена' })
  findOneByCode(@Param('code') code: string) {
    return this.modelsService.findOneByCode(code);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить модель' })
  @ApiResponse({ status: 200, description: 'Модель обновлена', type: Model })
  @ApiResponse({ status: 404, description: 'Модель не найдена' })
  @ApiResponse({ status: 404, description: 'Марка не найдена' })
  update(@Param('id') id: string, @Body() updateModelDto: UpdateModelDto) {
    return this.modelsService.update(id, updateModelDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить модель' })
  @ApiResponse({ status: 204, description: 'Модель удалена' })
  @ApiResponse({ status: 404, description: 'Модель не найдена' })
  remove(@Param('id') id: string) {
    return this.modelsService.remove(id);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Переключить статус активности модели' })
  @ApiResponse({ status: 200, description: 'Статус изменен', type: Model })
  @ApiResponse({ status: 404, description: 'Модель не найдена' })
  toggleActive(@Param('id') id: string) {
    return this.modelsService.toggleActive(id);
  }
}
