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
import { TransmissionsService } from './transmissions.service';
import { CreateTransmissionDto } from './dto/create-transmission.dto';
import { UpdateTransmissionDto } from './dto/update-transmission.dto';
import { Transmission } from './entities/transmission.entity';

@ApiTags('transmissions')
@Controller('transmissions')
export class TransmissionsController {
  constructor(private readonly transmissionsService: TransmissionsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новую коробку передач' })
  @ApiResponse({
    status: 201,
    description: 'Коробка передач успешно создана',
    type: Transmission,
  })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  create(@Body() createTransmissionDto: CreateTransmissionDto) {
    return this.transmissionsService.create(createTransmissionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все коробки передач' })
  @ApiResponse({
    status: 200,
    description: 'Список коробок передач',
    type: [Transmission],
  })
  findAll() {
    return this.transmissionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить коробку передач по ID' })
  @ApiResponse({
    status: 200,
    description: 'Коробка передач найдена',
    type: Transmission,
  })
  @ApiResponse({ status: 404, description: 'Коробка передач не найдена' })
  findOne(@Param('id') id: string) {
    return this.transmissionsService.findOne(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Получить коробку передач по коду' })
  @ApiResponse({
    status: 200,
    description: 'Коробка передач найдена',
    type: Transmission,
  })
  @ApiResponse({ status: 404, description: 'Коробка передач не найдена' })
  findOneByCode(@Param('code') code: string) {
    return this.transmissionsService.findOneByCode(code);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить коробку передач' })
  @ApiResponse({
    status: 200,
    description: 'Коробка передач обновлена',
    type: Transmission,
  })
  @ApiResponse({ status: 404, description: 'Коробка передач не найдена' })
  update(
    @Param('id') id: string,
    @Body() updateTransmissionDto: UpdateTransmissionDto,
  ) {
    return this.transmissionsService.update(id, updateTransmissionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить коробку передач' })
  @ApiResponse({ status: 204, description: 'Коробка передач удалена' })
  @ApiResponse({ status: 404, description: 'Коробка передач не найдена' })
  remove(@Param('id') id: string) {
    return this.transmissionsService.remove(id);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Переключить статус активности коробки передач' })
  @ApiResponse({
    status: 200,
    description: 'Статус изменен',
    type: Transmission,
  })
  @ApiResponse({ status: 404, description: 'Коробка передач не найдена' })
  toggleActive(@Param('id') id: string) {
    return this.transmissionsService.toggleActive(id);
  }
}
