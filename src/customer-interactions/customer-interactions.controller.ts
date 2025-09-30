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
import { CustomerInteractionsService } from './customer-interactions.service';
import { CreateCustomerInteractionDto } from './dto/create-customer-interaction.dto';
import { UpdateCustomerInteractionDto } from './dto/update-customer-interaction.dto';
import { CustomerInteraction } from './entities/customer-interaction.entity';

@ApiTags('customer-interactions')
@Controller('customer-interactions')
export class CustomerInteractionsController {
  constructor(
    private readonly customerInteractionsService: CustomerInteractionsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Создать новое взаимодействие с клиентом' })
  @ApiResponse({
    status: 201,
    description: 'Взаимодействие успешно создано',
    type: CustomerInteraction,
  })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  create(@Body() createCustomerInteractionDto: CreateCustomerInteractionDto) {
    console.log("createCustomerInteractionDto: ", createCustomerInteractionDto)
    return this.customerInteractionsService.create(
      createCustomerInteractionDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Получить все взаимодействия' })
  @ApiResponse({
    status: 200,
    description: 'Список взаимодействий',
    type: [CustomerInteraction],
  })
  @ApiQuery({
    name: 'customerId',
    required: false,
    description: 'Фильтр по ID клиента',
  })
  @ApiQuery({
    name: 'employeeId',
    required: false,
    description: 'Фильтр по ID сотрудника',
  })
  findAll(
    @Query('customerId') customerId?: string,
    @Query('employeeId') employeeId?: string,
  ) {
    if (customerId) {
      return this.customerInteractionsService.findByCustomer(customerId);
    }
    if (employeeId) {
      return this.customerInteractionsService.findByEmployee(employeeId);
    }
    return this.customerInteractionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить взаимодействие по ID' })
  @ApiResponse({
    status: 200,
    description: 'Взаимодействие найдено',
    type: CustomerInteraction,
  })
  @ApiResponse({ status: 404, description: 'Взаимодействие не найдено' })
  findOne(@Param('id') id: string) {
    return this.customerInteractionsService.findOne(id);
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Получить взаимодействия клиента' })
  @ApiResponse({
    status: 200,
    description: 'Список взаимодействий клиента',
    type: [CustomerInteraction],
  })
  findByCustomer(@Param('customerId') customerId: string) {
    return this.customerInteractionsService.findByCustomer(customerId);
  }

  @Get('employee/:employeeId')
  @ApiOperation({ summary: 'Получить взаимодействия сотрудника' })
  @ApiResponse({
    status: 200,
    description: 'Список взаимодействий сотрудника',
    type: [CustomerInteraction],
  })
  findByEmployee(@Param('employeeId') employeeId: string) {
    return this.customerInteractionsService.findByEmployee(employeeId);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Получить предстоящие взаимодействия' })
  @ApiResponse({
    status: 200,
    description: 'Список предстоящих взаимодействий',
    type: [CustomerInteraction],
  })
  @ApiQuery({
    name: 'days',
    required: false,
    description: 'Количество дней (по умолчанию 7)',
  })
  findUpcomingInteractions(@Query('days') days?: string) {
    const daysNum = days ? parseInt(days) : 7;
    return this.customerInteractionsService.findUpcomingInteractions(daysNum);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить взаимодействие' })
  @ApiResponse({
    status: 200,
    description: 'Взаимодействие обновлено',
    type: CustomerInteraction,
  })
  @ApiResponse({ status: 404, description: 'Взаимодействие не найдено' })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  update(
    @Param('id') id: string,
    @Body() updateCustomerInteractionDto: UpdateCustomerInteractionDto,
  ) {
    return this.customerInteractionsService.update(
      id,
      updateCustomerInteractionDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить взаимодействие' })
  @ApiResponse({ status: 204, description: 'Взаимодействие удалено' })
  @ApiResponse({ status: 404, description: 'Взаимодействие не найдено' })
  remove(@Param('id') id: string) {
    return this.customerInteractionsService.remove(id);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Переключить статус активности взаимодействия' })
  @ApiResponse({
    status: 200,
    description: 'Статус изменен',
    type: CustomerInteraction,
  })
  @ApiResponse({ status: 404, description: 'Взаимодействие не найдено' })
  toggleActive(@Param('id') id: string) {
    return this.customerInteractionsService.toggleActive(id);
  }
}
