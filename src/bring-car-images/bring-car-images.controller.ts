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
import { BringCarImagesService } from './bring-car-images.service';
import { CreateBringCarImageDto } from './dto/create-bring-car-image.dto';
import { UpdateBringCarImageDto } from './dto/update-bring-car-image.dto';
import { BringCarImage } from './entities/bring-car-image.entity';

@ApiTags('bring-car-images')
@Controller('bring-car-images')
export class BringCarImagesController {
  constructor(private readonly bringCarImagesService: BringCarImagesService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новое изображение для авто' })
  @ApiResponse({
    status: 201,
    description: 'Изображение успешно создано',
    type: BringCarImage,
  })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  create(@Body() createBringCarImageDto: CreateBringCarImageDto) {
    return this.bringCarImagesService.create(createBringCarImageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все изображения' })
  @ApiResponse({
    status: 200,
    description: 'Список изображений',
    type: [BringCarImage],
  })
  findAll() {
    return this.bringCarImagesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить изображение по ID' })
  @ApiResponse({
    status: 200,
    description: 'Изображение найдено',
    type: BringCarImage,
  })
  @ApiResponse({ status: 404, description: 'Изображение не найдено' })
  findOne(@Param('id') id: string) {
    return this.bringCarImagesService.findOne(id);
  }

  @Get('bring-car/:bringCarId')
  @ApiOperation({ summary: 'Получить изображения автомобиля' })
  @ApiResponse({
    status: 200,
    description: 'Список изображений',
    type: [BringCarImage],
  })
  findByBringCar(@Param('bringCarId') bringCarId: string) {
    return this.bringCarImagesService.findByBringCar(bringCarId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить изображение' })
  @ApiResponse({
    status: 200,
    description: 'Изображение обновлено',
    type: BringCarImage,
  })
  @ApiResponse({ status: 404, description: 'Изображение не найдено' })
  update(
    @Param('id') id: string,
    @Body() updateBringCarImageDto: UpdateBringCarImageDto,
  ) {
    return this.bringCarImagesService.update(id, updateBringCarImageDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить изображение' })
  @ApiResponse({ status: 204, description: 'Изображение удалено' })
  @ApiResponse({ status: 404, description: 'Изображение не найдено' })
  remove(@Param('id') id: string) {
    return this.bringCarImagesService.remove(id);
  }

  @Delete('bring-car/:bringCarId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить все изображения автомобиля' })
  @ApiResponse({ status: 204, description: 'Изображения удалены' })
  removeByBringCar(@Param('bringCarId') bringCarId: string) {
    return this.bringCarImagesService.deleteByBringCar(bringCarId);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Переключить статус активности изображения' })
  @ApiResponse({
    status: 200,
    description: 'Статус изменен',
    type: BringCarImage,
  })
  @ApiResponse({ status: 404, description: 'Изображение не найдено' })
  toggleActive(@Param('id') id: string) {
    return this.bringCarImagesService.toggleActive(id);
  }

  @Patch(':id/order')
  @ApiOperation({ summary: 'Обновить порядок изображения' })
  @ApiResponse({
    status: 200,
    description: 'Порядок обновлен',
    type: BringCarImage,
  })
  @ApiResponse({ status: 404, description: 'Изображение не найдено' })
  updateOrder(@Param('id') id: string, @Body('order') order: number) {
    return this.bringCarImagesService.updateOrder(id, order);
  }

  @Patch('bring-car/:bringCarId/reorder')
  @ApiOperation({ summary: 'Переупорядочить изображения автомобиля' })
  @ApiResponse({
    status: 200,
    description: 'Изображения переупорядочены',
    type: [BringCarImage],
  })
  reorderImages(
    @Param('bringCarId') bringCarId: string,
    @Body('imageIds') imageIds: string[],
  ) {
    return this.bringCarImagesService.reorderImages(bringCarId, imageIds);
  }
}
