// src/selections/selections.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Selection } from './entities/selection.entity';
import { CreateSelectionDto } from './dto/create-selection.dto';
import { UpdateSelectionDto } from './dto/update-selection.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SelectionsService {
  constructor(
    @InjectRepository(Selection)
    private selectionsRepository: Repository<Selection>,
  ) {}

  async create(
    createSelectionDto: CreateSelectionDto,
    user: User,
  ): Promise<Selection> {
    // Проверяем, что передан хотя бы один из вариантов
    if (!createSelectionDto.filters && !createSelectionDto.propertyIds) {
      throw new BadRequestException(
        'Необходимо указать фильтры или конкретные объекты недвижимости',
      );
    }

    // Проверяем количество существующих подборок пользователя
    const userSelectionsCount = await this.selectionsRepository.count({
      where: { userId: user.id },
    });

    if (userSelectionsCount >= 50) {
      // Лимит 50 подборок на пользователя
      throw new BadRequestException('Достигнут лимит подборок (50)');
    }

    // Создаем объект с правильными типами
    const selectionData = {
      ...createSelectionDto,
      userId: user.id,
      isShared: createSelectionDto.isShared || false,
    };

    const selection = this.selectionsRepository.create(selectionData);
    return this.selectionsRepository.save(selection);
  }

  async findAll(user: User, sharedOnly: boolean = false): Promise<Selection[]> {
    const where: any = { userId: user.id, isActive: true };

    if (sharedOnly) {
      where.isShared = true;
    }

    return this.selectionsRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, user: User): Promise<Selection> {
    const selection = await this.selectionsRepository.findOne({
      where: { id, isActive: true },
    });

    if (!selection) {
      throw new NotFoundException('Подборка не найдена');
    }

    if (selection.userId !== user.id && !selection.isShared) {
      throw new ForbiddenException('Нет доступа к этой подборке');
    }

    return selection;
  }

  async update(
    id: number,
    updateSelectionDto: UpdateSelectionDto,
    user: User,
  ): Promise<Selection> {
    const selection = await this.findOne(id, user);

    if (selection.userId !== user.id) {
      throw new ForbiddenException('Нет прав для редактирования этой подборки');
    }

    Object.assign(selection, updateSelectionDto);
    return this.selectionsRepository.save(selection);
  }

  async remove(id: number, user: User): Promise<void> {
    const selection = await this.findOne(id, user);

    if (selection.userId !== user.id) {
      throw new ForbiddenException('Нет прав для удаления этой подборки');
    }

    selection.isActive = false;
    await this.selectionsRepository.save(selection);
  }

  // Получение объектов по подборке (универсальный метод)
  async getPropertiesForSelection(
    selectionId: number,
    user: User,
  ): Promise<any> {
    const selection = await this.findOne(selectionId, user);

    // Если есть конкретные ID объектов - возвращаем их
    if (selection.propertyIds && selection.propertyIds.length > 0) {
      // Здесь будет логика получения конкретных объектов по ID
      // Пока возвращаем заглушку
      return {
        data: [],
        total: selection.propertyIds.length,
        message: 'Подборка по конкретным объектам',
      };
    }

    // Если есть фильтры - применяем их
    if (selection.filters) {
      // Преобразуем фильтры в формат, понятный PropertiesService
      const filters = this.transformFilters(selection.filters);

      // Здесь будет логика получения объектов по фильтрам
      // Пока возвращаем заглушку
      return {
        data: [],
        total: 0,
        message: 'Подборка по фильтрам',
      };
    }

    return {
      data: [],
      total: 0,
      message: 'Пустая подборка',
    };
  }

  // Преобразование фильтров в формат PropertiesService
  private transformFilters(filters: any): any {
    const transformed: any = {};

    // Пример преобразования:
    if (filters.rooms) {
      transformed.rooms = filters.rooms;
    }

    if (filters.maxPrice) {
      transformed.maxPrice = filters.maxPrice;
    }

    if (filters.minPrice) {
      transformed.minPrice = filters.minPrice;
    }

    if (filters.district) {
      transformed.district = filters.district;
    }

    // Добавьте другие преобразования по необходимости

    return transformed;
  }

  // Получение публичных подборок
  async getSharedSelections(): Promise<Selection[]> {
    return this.selectionsRepository.find({
      where: { isShared: true, isActive: true },
      order: { createdAt: 'DESC' },
      take: 20,
    });
  }
}
