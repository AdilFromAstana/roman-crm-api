// bring-car-statuses/bring-car-statuses.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BringCarStatus } from './entities/bring-car-status.entity';
import { CreateBringCarStatusDto } from './dto/create-bring-car-status.dto';
import { UpdateBringCarStatusDto } from './dto/update-bring-car-status.dto';

@Injectable()
export class BringCarStatusesService {
  constructor(
    @InjectRepository(BringCarStatus)
    private readonly bringCarStatusesRepository: Repository<BringCarStatus>,
  ) {}

  async create(
    createBringCarStatusDto: CreateBringCarStatusDto,
  ): Promise<BringCarStatus> {
    const status = this.bringCarStatusesRepository.create({
      ...createBringCarStatusDto,
      isActive: createBringCarStatusDto.isActive ?? true,
      sortOrder: createBringCarStatusDto.sortOrder ?? 0,
    });
    return this.bringCarStatusesRepository.save(status);
  }

  async findAll(): Promise<BringCarStatus[]> {
    return this.bringCarStatusesRepository.find({
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async findOne(code: string): Promise<BringCarStatus> {
    const status = await this.bringCarStatusesRepository.findOne({
      where: { code },
    });
    if (!status) {
      throw new NotFoundException(`BringCarStatus with code ${code} not found`);
    }
    return status;
  }

  async findOneByCode(code: string): Promise<BringCarStatus> {
    const status = await this.bringCarStatusesRepository.findOne({
      where: { code },
    });
    if (!status) {
      throw new NotFoundException(`BringCarStatus with code ${code} not found`);
    }
    return status;
  }

  async update(
    code: string,
    updateBringCarStatusDto: UpdateBringCarStatusDto,
  ): Promise<BringCarStatus> {
    const status = await this.findOne(code);
    Object.assign(status, updateBringCarStatusDto);
    return this.bringCarStatusesRepository.save(status);
  }

  async remove(code: string): Promise<void> {
    const status = await this.findOne(code);
    await this.bringCarStatusesRepository.remove(status);
  }

  async toggleActive(code: string): Promise<BringCarStatus> {
    const status = await this.findOne(code);
    status.isActive = !status.isActive;
    return this.bringCarStatusesRepository.save(status);
  }

  // Создание стандартных статусов
  async createDefaultStatuses(): Promise<BringCarStatus[]> {
    const defaultStatuses = [
      {
        code: 'BRINGED',
        name: 'Привезен',
        description: 'Автомобиль привезен владельцем в салон',
        sortOrder: 1,
      },
      {
        code: 'ON_SALE',
        name: 'На продаже',
        description: 'Автомобиль выставлен на продажу',
        sortOrder: 2,
      },
      {
        code: 'RESERVED',
        name: 'Забронирован',
        description: 'Автомобиль забронирован потенциальным покупателем',
        sortOrder: 3,
      },
      {
        code: 'SOLD',
        name: 'Продан',
        description: 'Автомобиль продан',
        sortOrder: 4,
      },
      {
        code: 'OWNER_RETURNED',
        name: 'Возвращен владельцу',
        description: 'Автомобиль возвращен владельцу',
        sortOrder: 5,
      },
      {
        code: 'NOT_SOLD_RETURNED',
        name: 'Не продан, возвращен',
        description: 'Автомобиль не продан и возвращен владельцу',
        sortOrder: 6,
      },
      {
        code: 'UNDER_REPAIR',
        name: 'На ремонте',
        description: 'Автомобиль находится на техническом обслуживании',
        sortOrder: 7,
      },
      {
        code: 'DOCUMENTS_PREPARING',
        name: 'Подготовка документов',
        description: 'Подготовка документов для продажи',
        sortOrder: 8,
      },
    ];

    const existingStatuses = await this.findAll();
    const newStatuses: BringCarStatus[] = [];

    for (const statusData of defaultStatuses) {
      const exists = existingStatuses.find((s) => s.code === statusData.code);
      if (!exists) {
        const status = this.bringCarStatusesRepository.create({
          ...statusData,
          isActive: true,
        });
        const savedStatus = await this.bringCarStatusesRepository.save(status);
        newStatuses.push(savedStatus);
      }
    }

    return newStatuses;
  }
}
