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
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';

@ApiTags('brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новую марку' })
  @ApiResponse({
    status: 201,
    description: 'Марка успешно создана',
    type: Brand,
  })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все марки' })
  @ApiResponse({ status: 200, description: 'Список марок', type: [Brand] })
  findAll() {
    return this.brandsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить марку по ID' })
  @ApiResponse({ status: 200, description: 'Марка найдена', type: Brand })
  @ApiResponse({ status: 404, description: 'Марка не найдена' })
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Получить марку по коду' })
  @ApiResponse({ status: 200, description: 'Марка найдена', type: Brand })
  @ApiResponse({ status: 404, description: 'Марка не найдена' })
  findOneByCode(@Param('code') code: string) {
    return this.brandsService.findOneByCode(code);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить марку' })
  @ApiResponse({ status: 200, description: 'Марка обновлена', type: Brand })
  @ApiResponse({ status: 404, description: 'Марка не найдена' })
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(id, updateBrandDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить марку' })
  @ApiResponse({ status: 204, description: 'Марка удалена' })
  @ApiResponse({ status: 404, description: 'Марка не найдена' })
  remove(@Param('id') id: string) {
    return this.brandsService.remove(id);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Переключить статус активности марки' })
  @ApiResponse({ status: 200, description: 'Статус изменен', type: Brand })
  @ApiResponse({ status: 404, description: 'Марка не найдена' })
  toggleActive(@Param('id') id: string) {
    return this.brandsService.toggleActive(id);
  }
}
