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
import { FeaturesService } from './features.service';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { Feature } from './entities/feature.entity';

@ApiTags('features')
@Controller('features')
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новую особенность' })
  @ApiResponse({
    status: 201,
    description: 'Особенность успешно создана',
    type: Feature,
  })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  create(@Body() createFeatureDto: CreateFeatureDto) {
    return this.featuresService.create(createFeatureDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все особенности' })
  @ApiResponse({
    status: 200,
    description: 'Список особенностей',
    type: [Feature],
  })
  findAll() {
    return this.featuresService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить особенность по ID' })
  @ApiResponse({
    status: 200,
    description: 'Особенность найдена',
    type: Feature,
  })
  @ApiResponse({ status: 404, description: 'Особенность не найдена' })
  findOne(@Param('id') id: string) {
    return this.featuresService.findOne(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Получить особенность по коду' })
  @ApiResponse({
    status: 200,
    description: 'Особенность найдена',
    type: Feature,
  })
  @ApiResponse({ status: 404, description: 'Особенность не найдена' })
  findOneByCode(@Param('code') code: string) {
    return this.featuresService.findOneByCode(code);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить особенность' })
  @ApiResponse({
    status: 200,
    description: 'Особенность обновлена',
    type: Feature,
  })
  @ApiResponse({ status: 404, description: 'Особенность не найдена' })
  update(@Param('id') id: string, @Body() updateFeatureDto: UpdateFeatureDto) {
    return this.featuresService.update(id, updateFeatureDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить особенность' })
  @ApiResponse({ status: 204, description: 'Особенность удалена' })
  @ApiResponse({ status: 404, description: 'Особенность не найдена' })
  remove(@Param('id') id: string) {
    return this.featuresService.remove(id);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Переключить статус активности особенности' })
  @ApiResponse({ status: 200, description: 'Статус изменен', type: Feature })
  @ApiResponse({ status: 404, description: 'Особенность не найдена' })
  toggleActive(@Param('id') id: string) {
    return this.featuresService.toggleActive(id);
  }
}
