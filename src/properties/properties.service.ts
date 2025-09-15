// src/properties/properties.service.ts
import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { GetPropertiesDto } from './dto/get-properties.dto';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { PropertyStatus } from '../common/enums/property-status.enum';
import { PropertyTag } from 'src/common/enums/property-tag.enum';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private propertiesRepository: Repository<Property>,
  ) {}

  async create(
    createPropertyDto: CreatePropertyDto,
    user: User,
  ): Promise<Property> {
    // Проверка прав доступа
    if (!this.canCreateProperty(user)) {
      throw new ForbiddenException('У вас нет прав для создания недвижимости');
    }

    // Проверка принадлежности к организации
    if (!user.agency.id) {
      throw new BadRequestException('Пользователь не привязан к организации');
    }

    const property = this.propertiesRepository.create({
      ...createPropertyDto,
      ownerId: user.id,
      agencyId: user.agency.id,
      currency: createPropertyDto.currency || 'KZT',
    });

    return this.propertiesRepository.save(property);
  }

  async findAll(query: GetPropertiesDto, user: User): Promise<any> {
    const {
      page = 1,
      limit = 10,
      search,
      type,
      status,
      tags,
      city,
      district,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      rooms,
      isPublished,
      agencyId,
      ownerId,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const skip = (page - 1) * limit;

    const queryBuilder = this.propertiesRepository
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.owner', 'owner')
      .leftJoinAndSelect('property.agency', 'agency');

    // Фильтрация по правам доступа
    if (!this.canViewAllProperties(user)) {
      queryBuilder.andWhere('property.agencyId = :agencyId', {
        agencyId: user.agency.id,
      });
    }

    // Поиск по тексту
    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('property.title ILIKE :search', { search: `%${search}%` })
            .orWhere('property.description ILIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('property.city ILIKE :search', { search: `%${search}%` })
            .orWhere('property.district ILIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('property.address ILIKE :search', {
              search: `%${search}%`,
            });
        }),
      );
    }

    // Фильтры
    if (type) {
      queryBuilder.andWhere('property.type = :type', { type });
    }

    if (status) {
      queryBuilder.andWhere('property.status = :status', { status });
    }

    if (tags && tags.length > 0) {
      queryBuilder.andWhere('property.tags && :tags', { tags });
    }

    if (city) {
      queryBuilder.andWhere('property.city ILIKE :city', { city: `%${city}%` });
    }

    if (district) {
      queryBuilder.andWhere('property.district ILIKE :district', {
        district: `%${district}%`,
      });
    }

    if (minPrice !== undefined) {
      queryBuilder.andWhere('property.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      queryBuilder.andWhere('property.price <= :maxPrice', { maxPrice });
    }

    if (minArea !== undefined) {
      queryBuilder.andWhere('property.area >= :minArea', { minArea });
    }

    if (maxArea !== undefined) {
      queryBuilder.andWhere('property.area <= :maxArea', { maxArea });
    }

    if (rooms !== undefined) {
      queryBuilder.andWhere('property.rooms = :rooms', { rooms });
    }

    if (isPublished !== undefined) {
      queryBuilder.andWhere('property.isPublished = :isPublished', {
        isPublished,
      });
    }

    if (agencyId) {
      queryBuilder.andWhere('property.agencyId = :agencyId', { agencyId });
    }

    if (ownerId) {
      queryBuilder.andWhere('property.ownerId = :ownerId', { ownerId });
    }

    // Сортировка
    const allowedSortFields = ['price', 'area', 'createdAt'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    queryBuilder.orderBy(`property.${sortField}`, sortOrder);

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number, user: User): Promise<Property> {
    const property = await this.propertiesRepository.findOne({
      where: { id },
      relations: ['owner', 'agency'],
    });

    if (!property) {
      throw new NotFoundException('Недвижимость не найдена');
    }

    // Проверка прав доступа
    if (!this.canViewProperty(property, user)) {
      throw new ForbiddenException(
        'У вас нет прав для просмотра этой недвижимости',
      );
    }

    return property;
  }

  async update(
    id: number,
    updatePropertyDto: UpdatePropertyDto,
    user: User,
  ): Promise<Property> {
    const property = await this.findOne(id, user);

    if (!this.canEditProperty(property, user)) {
      throw new ForbiddenException(
        'У вас нет прав для редактирования этой недвижимости',
      );
    }

    Object.assign(property, updatePropertyDto);
    return this.propertiesRepository.save(property);
  }

  async remove(id: number, user: User): Promise<void> {
    const property = await this.findOne(id, user);

    // Проверка прав на удаление
    if (!this.canDeleteProperty(property, user)) {
      throw new ForbiddenException(
        'У вас нет прав для удаления этой недвижимости',
      );
    }

    await this.propertiesRepository.remove(property);
  }

  // Методы проверки прав доступа
  private canCreateProperty(user: User): boolean {
    return user.roles.some((role) =>
      [UserRole.AGENCY_ADMIN, UserRole.REALTOR, UserRole.MANAGER].includes(
        role.name as UserRole,
      ),
    );
  }

  private canViewAllProperties(user: User): boolean {
    return user.roles.some((role) =>
      [UserRole.ADMIN, UserRole.AGENCY_ADMIN].includes(role.name as UserRole),
    );
  }

  private canViewProperty(property: Property, user: User): boolean {
    if (this.canViewAllProperties(user)) return true;
    return property.agencyId === user.agency.id;
  }

  private canEditProperty(property: Property, user: User): boolean {
    if (user.roles.some((role) => role.name === UserRole.ADMIN)) return true;
    if (user.roles.some((role) => role.name === UserRole.AGENCY_ADMIN))
      return property.agencyId === user.agency.id;
    return property.ownerId === user.id;
  }

  private canDeleteProperty(property: Property, user: User): boolean {
    return this.canEditProperty(property, user);
  }

  // Специальные методы для изменения статуса
  async updateStatus(
    id: number,
    status: PropertyStatus,
    user: User,
  ): Promise<Property> {
    const property = await this.findOne(id, user);

    if (!this.canEditProperty(property, user)) {
      throw new ForbiddenException(
        'У вас нет прав для изменения статуса этой недвижимости',
      );
    }

    property.status = status;
    return this.propertiesRepository.save(property);
  }

  // Методы для работы с тегами
  async addTag(id: number, tag: PropertyTag, user: User): Promise<Property> {
    const property = await this.findOne(id, user);

    if (!this.canEditProperty(property, user)) {
      throw new ForbiddenException(
        'У вас нет прав для добавления тега этой недвижимости',
      );
    }

    if (!property.tags) {
      property.tags = [];
    }

    if (!property.tags.includes(tag)) {
      property.tags.push(tag);
      return this.propertiesRepository.save(property);
    }

    return property;
  }

  async removeTag(id: number, tag: PropertyTag, user: User): Promise<Property> {
    const property = await this.findOne(id, user);

    if (!this.canEditProperty(property, user)) {
      throw new ForbiddenException(
        'У вас нет прав для удаления тега этой недвижимости',
      );
    }

    if (property.tags && property.tags.includes(tag)) {
      property.tags = property.tags.filter((t) => t !== tag);
      return this.propertiesRepository.save(property);
    }

    return property;
  }
}
