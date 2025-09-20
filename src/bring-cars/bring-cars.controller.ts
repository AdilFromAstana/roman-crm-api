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
import { BringCarsService } from './bring-cars.service';
import { CreateBringCarDto } from './dto/create-bring-car.dto';
import { UpdateBringCarDto } from './dto/update-bring-car.dto';
import { BringCar } from './entities/bring-car.entity';

@ApiTags('bring-cars')
@Controller('bring-cars')
export class BringCarsController {
  constructor(private readonly bringCarsService: BringCarsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новый автомобиль для загона' })
  @ApiResponse({
    status: 201,
    description: 'Автомобиль успешно создан',
    type: BringCar,
  })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  create(@Body() createBringCarDto: CreateBringCarDto) {
    return this.bringCarsService.create(createBringCarDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все автомобили для загона' })
  @ApiResponse({
    status: 200,
    description: 'Список автомобилей',
    type: [BringCar],
  })
  findAll() {
    return this.bringCarsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить автомобиль по ID' })
  @ApiResponse({
    status: 200,
    description: 'Автомобиль найден',
    type: BringCar,
  })
  @ApiResponse({ status: 404, description: 'Автомобиль не найден' })
  findOne(@Param('id') id: string) {
    return this.bringCarsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить автомобиль' })
  @ApiResponse({
    status: 200,
    description: 'Автомобиль обновлен',
    type: BringCar,
  })
  @ApiResponse({ status: 404, description: 'Автомобиль не найден' })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  update(
    @Param('id') id: string,
    @Body() updateBringCarDto: UpdateBringCarDto,
  ) {
    return this.bringCarsService.update(id, updateBringCarDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить автомобиль' })
  @ApiResponse({ status: 204, description: 'Автомобиль удален' })
  @ApiResponse({ status: 404, description: 'Автомобиль не найден' })
  remove(@Param('id') id: string) {
    return this.bringCarsService.remove(id);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Переключить статус активности автомобиля' })
  @ApiResponse({ status: 200, description: 'Статус изменен', type: BringCar })
  @ApiResponse({ status: 404, description: 'Автомобиль не найден' })
  toggleActive(@Param('id') id: string) {
    return this.bringCarsService.toggleActive(id);
  }

}
