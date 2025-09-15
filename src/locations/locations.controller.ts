// src/locations/locations.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LocationsService } from './locations.service';
import { CreateCityDto } from './dto/create-city.dto';
import { CreateDistrictDto } from './dto/create-district.dto';

@ApiTags('Локации')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  // Города
  @Post('cities')
  @ApiOperation({ summary: 'Создание нового города' })
  @ApiResponse({ status: 201, description: 'Город успешно создан' })
  async createCity(@Body(ValidationPipe) createCityDto: CreateCityDto) {
    return this.locationsService.createCity(createCityDto);
  }

  @Get('cities')
  @ApiOperation({ summary: 'Получение списка городов' })
  @ApiResponse({ status: 200, description: 'Список городов' })
  async findAllCities() {
    return this.locationsService.findAllCities();
  }

  @Get('cities/:id')
  @ApiOperation({ summary: 'Получение информации о городе' })
  @ApiResponse({ status: 200, description: 'Информация о городе' })
  async findCityById(@Param('id') id: string) {
    return this.locationsService.findCityById(+id);
  }

  @Put('cities/:id')
  @ApiOperation({ summary: 'Обновление информации о городе' })
  @ApiResponse({ status: 200, description: 'Город успешно обновлен' })
  async updateCity(
    @Param('id') id: string,
    @Body(ValidationPipe) updateCityDto: Partial<CreateCityDto>,
  ) {
    return this.locationsService.updateCity(+id, updateCityDto);
  }

  // Районы
  @Post('districts')
  @ApiOperation({ summary: 'Создание нового района' })
  @ApiResponse({ status: 201, description: 'Район успешно создан' })
  async createDistrict(
    @Body(ValidationPipe) createDistrictDto: CreateDistrictDto,
  ) {
    return this.locationsService.createDistrict(createDistrictDto);
  }

  @Get('districts')
  @ApiOperation({ summary: 'Получение списка районов' })
  @ApiResponse({ status: 200, description: 'Список районов' })
  async findAllDistricts(@Query('cityId') cityId?: string) {
    return this.locationsService.findAllDistricts(cityId ? +cityId : undefined);
  }

  @Get('districts/:id')
  @ApiOperation({ summary: 'Получение информации о районе' })
  @ApiResponse({ status: 200, description: 'Информация о районе' })
  async findDistrictById(@Param('id') id: string) {
    return this.locationsService.findDistrictById(+id);
  }

  @Get('cities/:cityId/districts')
  @ApiOperation({ summary: 'Получение списка районов города' })
  @ApiResponse({ status: 200, description: 'Список районов города' })
  async findDistrictsByCity(@Param('cityId') cityId: string) {
    return this.locationsService.findDistrictsByCity(+cityId);
  }

  @Put('districts/:id')
  @ApiOperation({ summary: 'Обновление информации о районе' })
  @ApiResponse({ status: 200, description: 'Район успешно обновлен' })
  async updateDistrict(
    @Param('id') id: string,
    @Body(ValidationPipe) updateDistrictDto: Partial<CreateDistrictDto>,
  ) {
    return this.locationsService.updateDistrict(+id, updateDistrictDto);
  }
}
