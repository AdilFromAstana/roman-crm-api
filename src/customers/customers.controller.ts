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
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @ApiOperation({ summary: 'Создать нового клиента' })
  @ApiResponse({
    status: 201,
    description: 'Клиент успешно создан',
    type: Customer,
  })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить всех клиентов' })
  @ApiResponse({
    status: 200,
    description: 'Список клиентов',
    type: [Customer],
  })
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить клиента по ID' })
  @ApiResponse({ status: 200, description: 'Клиент найден', type: Customer })
  @ApiResponse({ status: 404, description: 'Клиент не найден' })
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Get('phone/:phone')
  @ApiOperation({ summary: 'Получить клиента по телефону' })
  @ApiResponse({ status: 200, description: 'Клиент найден', type: Customer })
  @ApiResponse({ status: 404, description: 'Клиент не найден' })
  findOneByPhone(@Param('phone') phone: string) {
    return this.customersService.findOneByPhone(phone);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Получить клиента по email' })
  @ApiResponse({ status: 200, description: 'Клиент найден', type: Customer })
  @ApiResponse({ status: 404, description: 'Клиент не найден' })
  findOneByEmail(@Param('email') email: string) {
    return this.customersService.findOneByEmail(email);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить клиента' })
  @ApiResponse({ status: 200, description: 'Клиент обновлен', type: Customer })
  @ApiResponse({ status: 404, description: 'Клиент не найден' })
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить клиента' })
  @ApiResponse({ status: 204, description: 'Клиент удален' })
  @ApiResponse({ status: 404, description: 'Клиент не найден' })
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Переключить статус активности клиента' })
  @ApiResponse({ status: 200, description: 'Статус изменен', type: Customer })
  @ApiResponse({ status: 404, description: 'Клиент не найден' })
  toggleActive(@Param('id') id: string) {
    return this.customersService.toggleActive(id);
  }

  @Get('iin/:iin')
  @ApiOperation({ summary: 'Получить клиента по ИИН' })
  @ApiResponse({ status: 200, description: 'Клиент найден', type: Customer })
  @ApiResponse({ status: 404, description: 'Клиент не найден' })
  findOneByIin(@Param('iin') iin: string) {
    return this.customersService.findOneByIin(iin);
  }
}
