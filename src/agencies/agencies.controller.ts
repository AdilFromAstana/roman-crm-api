// src/agencies/agencies.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AgenciesService } from './agencies.service';
import { AgencyDto } from '../auth/dto/register-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';

@ApiTags('Агентства')
@Controller('agencies')
export class AgenciesController {
  constructor(private readonly agenciesService: AgenciesService) {}

  @Get()
  @ApiOperation({ summary: 'Получение списка всех агентств' })
  @ApiResponse({ status: 200, description: 'Список агентств' })
  async findAll() {
    return this.agenciesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получение информации об агентстве' })
  @ApiResponse({ status: 200, description: 'Информация об агентстве' })
  @ApiResponse({ status: 404, description: 'Агентство не найдено' })
  async findOne(@Param('id') id: string) {
    return this.agenciesService.findOneById(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Создание нового агентства' })
  @ApiResponse({ status: 201, description: 'Агентство успешно создано' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации данных' })
  async create(@Body(ValidationPipe) agencyDto: AgencyDto) {
    return this.agenciesService.create(agencyDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновление информации об агентстве' })
  @ApiResponse({ status: 200, description: 'Агентство успешно обновлено' })
  @ApiResponse({ status: 404, description: 'Агентство не найдено' })
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateAgencyDto: UpdateAgencyDto,
  ) {
    return this.agenciesService.update(+id, updateAgencyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удаление агентства' })
  @ApiResponse({ status: 200, description: 'Агентство успешно удалено' })
  @ApiResponse({ status: 404, description: 'Агентство не найдено' })
  async remove(@Param('id') id: string) {
    return this.agenciesService.remove(+id);
  }

  @Get(':id/users')
  @ApiOperation({ summary: 'Получение всех сотрудников агентства' })
  @ApiResponse({ status: 200, description: 'Список сотрудников' })
  @ApiResponse({ status: 404, description: 'Агентство не найдено' })
  async getAgencyUsers(@Param('id') id: string) {
    return this.agenciesService.getAgencyUsers(+id);
  }
}
