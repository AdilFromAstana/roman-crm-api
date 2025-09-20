import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesStatus } from './entities/sales-status.entity';
import { CreateSalesStatusDto } from './dto/create-sales-status.dto';
import { UpdateSalesStatusDto } from './dto/update-sales-status.dto';

@Injectable()
export class SalesStatusesService {
  constructor(
    @InjectRepository(SalesStatus)
    private readonly salesStatusesRepository: Repository<SalesStatus>,
  ) {}

  async create(
    createSalesStatusDto: CreateSalesStatusDto,
  ): Promise<SalesStatus> {
    const salesStatus = this.salesStatusesRepository.create({
      ...createSalesStatusDto,
      isActive: createSalesStatusDto.isActive ?? true,
    });
    return this.salesStatusesRepository.save(salesStatus);
  }

  async findAll(): Promise<SalesStatus[]> {
    return this.salesStatusesRepository.find({
      order: { order: 'ASC', name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<SalesStatus> {
    const salesStatus = await this.salesStatusesRepository.findOne({
      where: { id },
    });
    if (!salesStatus) {
      throw new NotFoundException(`Sales status with ID ${id} not found`);
    }
    return salesStatus;
  }

  async findOneByCode(code: string): Promise<SalesStatus> {
    const salesStatus = await this.salesStatusesRepository.findOne({
      where: { code },
    });
    if (!salesStatus) {
      throw new NotFoundException(`Sales status with code ${code} not found`);
    }
    return salesStatus;
  }

  async findByOrder(order: number): Promise<SalesStatus> {
    const salesStatus = await this.salesStatusesRepository.findOne({
      where: { order },
    });
    if (!salesStatus) {
      throw new NotFoundException(`Sales status with order ${order} not found`);
    }
    return salesStatus;
  }

  async update(
    id: string,
    updateSalesStatusDto: UpdateSalesStatusDto,
  ): Promise<SalesStatus> {
    const salesStatus = await this.findOne(id);
    Object.assign(salesStatus, updateSalesStatusDto);
    return this.salesStatusesRepository.save(salesStatus);
  }

  async remove(id: string): Promise<void> {
    const salesStatus = await this.findOne(id);
    await this.salesStatusesRepository.remove(salesStatus);
  }

  async toggleActive(id: string): Promise<SalesStatus> {
    const salesStatus = await this.findOne(id);
    salesStatus.isActive = !salesStatus.isActive;
    return this.salesStatusesRepository.save(salesStatus);
  }

  // Сиды для стандартных статусов продаж
  async createDefaultStatuses(): Promise<SalesStatus[]> {
    const defaultStatuses = [
      {
        code: 'ON_APPROVAL',
        name: 'На одобрении',
        color: '#2196F3',
        icon: 'approval',
        order: 1,
        description: 'Клиент находится на стадии одобрения кредита',
      },
      {
        code: 'ON_PROCESSING',
        name: 'На оформлении',
        color: '#FF9800',
        icon: 'processing',
        order: 2,
        description: 'Кредит одобрен, оформление документов',
      },
      {
        code: 'SOLD',
        name: 'Продан',
        color: '#4CAF50',
        icon: 'sold',
        order: 3,
        description: 'Автомобиль продан, ожидание выдачи бонусов',
      },
      {
        code: 'BONUSES_ISSUED',
        name: 'Бонусы выданы',
        color: '#9C27B0',
        icon: 'bonus',
        order: 4,
        description: 'Бонусы выданы менеджеру',
      },
      {
        code: 'COMMISSION_ISSUED',
        name: 'Комиссия выдана',
        color: '#FF5722',
        icon: 'commission',
        order: 5,
        description: 'Комиссия выдана, сделка завершена',
      },
    ];

    const existingStatuses = await this.findAll();
    const newStatuses: SalesStatus[] = [];

    for (const statusData of defaultStatuses) {
      const exists = existingStatuses.find((s) => s.code === statusData.code);
      if (!exists) {
        const status = this.salesStatusesRepository.create({
          ...statusData,
          isActive: true,
        });
        const savedStatus = await this.salesStatusesRepository.save(status);
        newStatuses.push(savedStatus);
      }
    }

    return newStatuses;
  }
}
