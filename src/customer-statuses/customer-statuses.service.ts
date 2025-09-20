import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerStatus } from './entities/customer-status.entity';
import { CreateCustomerStatusDto } from './dto/create-customer-status.dto';
import { UpdateCustomerStatusDto } from './dto/update-customer-status.dto';

@Injectable()
export class CustomerStatusesService {
  constructor(
    @InjectRepository(CustomerStatus)
    private readonly customerStatusesRepository: Repository<CustomerStatus>,
  ) {}

  async create(
    createCustomerStatusDto: CreateCustomerStatusDto,
  ): Promise<CustomerStatus> {
    const customerStatus = this.customerStatusesRepository.create({
      ...createCustomerStatusDto,
      sortOrder: createCustomerStatusDto.sortOrder ?? 0,
      isActive: createCustomerStatusDto.isActive ?? true,
    });
    return this.customerStatusesRepository.save(customerStatus);
  }

  async findAll(): Promise<CustomerStatus[]> {
    return this.customerStatusesRepository.find({
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<CustomerStatus> {
    const customerStatus = await this.customerStatusesRepository.findOne({
      where: { id },
    });
    if (!customerStatus) {
      throw new NotFoundException(`Customer status with ID ${id} not found`);
    }
    return customerStatus;
  }

  async findOneByCode(code: string): Promise<CustomerStatus> {
    const customerStatus = await this.customerStatusesRepository.findOne({
      where: { code },
    });
    if (!customerStatus) {
      throw new NotFoundException(
        `Customer status with code ${code} not found`,
      );
    }
    return customerStatus;
  }

  async update(
    id: string,
    updateCustomerStatusDto: UpdateCustomerStatusDto,
  ): Promise<CustomerStatus> {
    const customerStatus = await this.findOne(id);
    Object.assign(customerStatus, updateCustomerStatusDto);
    return this.customerStatusesRepository.save(customerStatus);
  }

  async remove(id: string): Promise<void> {
    const customerStatus = await this.findOne(id);
    await this.customerStatusesRepository.remove(customerStatus);
  }

  async toggleActive(id: string): Promise<CustomerStatus> {
    const customerStatus = await this.findOne(id);
    customerStatus.isActive = !customerStatus.isActive;
    return this.customerStatusesRepository.save(customerStatus);
  }

  // Сиды для стандартных статусов клиентов
  async createDefaultStatuses(): Promise<CustomerStatus[]> {
    const defaultStatuses = [
      {
        code: 'ACTIVE',
        name: 'Активный',
        color: '#4CAF50',
        icon: 'check',
        sortOrder: 1,
        description: 'Обычный активный клиент',
      },
      {
        code: 'WARMING',
        name: 'Прогрев',
        color: '#FF9800',
        icon: 'thermometer',
        sortOrder: 2,
        description: 'Клиент на стадии прогрева',
      },
      {
        code: 'UNWANTED',
        name: 'Нежелательный',
        color: '#F44336',
        icon: 'alert',
        sortOrder: 3,
        description: 'Нежелательный клиент',
      },
      {
        code: 'BOUGHT_ELSEWHERE',
        name: 'Купил в другом месте',
        color: '#9E9E9E',
        icon: 'cancel',
        sortOrder: 4,
        description: 'Клиент купил автомобиль в другом месте',
      },
      {
        code: 'NOT_INTERESTED',
        name: 'Не нуждается',
        color: '#757575',
        icon: 'block',
        sortOrder: 5,
        description: 'Клиент не нуждается в автомобиле',
      },
      {
        code: 'FOLLOW_UP',
        name: 'Повторный контакт',
        color: '#2196F3',
        icon: 'refresh',
        sortOrder: 6,
        description: 'Требуется повторный контакт',
      },
    ];

    const existingStatuses = await this.findAll();
    const newStatuses: CustomerStatus[] = [];

    for (const statusData of defaultStatuses) {
      const exists = existingStatuses.find((s) => s.code === statusData.code);
      if (!exists) {
        const status = this.customerStatusesRepository.create({
          ...statusData,
          isActive: true,
        });
        const savedStatus = await this.customerStatusesRepository.save(status);
        newStatuses.push(savedStatus);
      }
    }

    return newStatuses;
  }
}
