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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale } from './entities/sale.entity';
import { GetSalesDto } from './dto/get-sales.dto';

@ApiTags('sales')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новую продажу' })
  @ApiResponse({
    status: 201,
    description: 'Продажа успешно создана',
    type: Sale,
  })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  // @Get()
  // @ApiOperation({ summary: 'Получить все продажи' })
  // @ApiResponse({ status: 200, description: 'Список продаж', type: [Sale] })
  // findAll() {
  //   return this.salesService.findAll();
  // }

  @Get()
  @ApiOperation({ summary: 'Получить продажи с пагинацией и фильтрацией' })
  @ApiResponse({
    status: 200,
    description: 'Список продаж с метаданными',
    schema: {
      example: {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      },
    },
  })
  async getSales(@Query() query: GetSalesDto) {
    return this.salesService.getSales(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить продажу по ID' })
  @ApiResponse({ status: 200, description: 'Продажа найдена', type: Sale })
  @ApiResponse({ status: 404, description: 'Продажа не найдена' })
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @Get('bring-car/:bringCarId')
  @ApiOperation({ summary: 'Получить продажу по ID загнанного авто' })
  @ApiResponse({ status: 200, description: 'Продажа найдена', type: Sale })
  @ApiResponse({ status: 404, description: 'Продажа не найдена' })
  findOneByBringCar(@Param('bringCarId') bringCarId: string) {
    return this.salesService.findOneByBringCar(bringCarId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Получить статистику продаж' })
  @ApiResponse({ status: 200, description: 'Статистика продаж' })
  getStats() {
    return this.salesService.getSalesStats();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить продажу' })
  @ApiResponse({ status: 200, description: 'Продажа обновлена', type: Sale })
  @ApiResponse({ status: 404, description: 'Продажа не найдена' })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.salesService.update(id, updateSaleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить продажу' })
  @ApiResponse({ status: 204, description: 'Продажа удалена' })
  @ApiResponse({ status: 404, description: 'Продажа не найдена' })
  remove(@Param('id') id: string) {
    return this.salesService.remove(id);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Переключить статус активности продажи' })
  @ApiResponse({ status: 200, description: 'Статус изменен', type: Sale })
  @ApiResponse({ status: 404, description: 'Продажа не найдена' })
  toggleActive(@Param('id') id: string) {
    return this.salesService.toggleActive(id);
  }
}
