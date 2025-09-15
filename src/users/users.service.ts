// src/users/users.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async save(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async findOneByRefreshToken(refreshToken: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { refreshToken } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }

    const roles = await this.rolesRepository.findByIds(createUserDto.roleIds);
    if (roles.length !== createUserDto.roleIds.length) {
      throw new BadRequestException('Одна или несколько ролей не найдены');
    }

    const user = this.usersRepository.create({
      ...createUserDto,
      roles,
    });

    return this.usersRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async blockUser(id: number): Promise<User> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    user.isActive = false;
    return this.usersRepository.save(user);
  }

  async addRoles(userId: number, roleIds: number[]): Promise<User> {
    const user = await this.findOneById(userId);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const newRoles = await this.rolesRepository.findByIds(roleIds);
    if (newRoles.length !== roleIds.length) {
      throw new BadRequestException('Одна или несколько ролей не найдены');
    }

    // Объединяем существующие и новые роли
    user.roles = [...user.roles, ...newRoles];
    return this.usersRepository.save(user);
  }

  async removeRoles(userId: number, roleIds: number[]): Promise<User> {
    const user = await this.findOneById(userId);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Удаляем указанные роли
    user.roles = user.roles.filter((role) => !roleIds.includes(role.id));
    return this.usersRepository.save(user);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['roles', 'agency'],
    });
  }

  async findOneById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['roles', 'agency'],
    });
  }

  async initializeRoles(): Promise<void> {
    const roles = [
      { name: 'admin', description: 'Главный администратор системы' },
      { name: 'agency_admin', description: 'Администратор агентства' },
      { name: 'realtor', description: 'Риэлтор' },
      { name: 'manager', description: 'Менеджер' },
    ];

    for (const roleData of roles) {
      const existingRole = await this.rolesRepository.findOne({
        where: { name: roleData.name },
      });

      if (!existingRole) {
        const role = this.rolesRepository.create(roleData);
        await this.rolesRepository.save(role);
      }
    }
  }

  async findAll(query: GetUsersDto): Promise<any> {
    const {
      page = 1,
      limit = 10,
      search,
      isActive,
      isVerified,
      role,
      agencyId,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const skip = (page - 1) * limit;

    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('user.agency', 'agency');

    // Поиск по имени, фамилии, email
    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('user.firstName ILIKE :search', { search: `%${search}%` })
            .orWhere('user.lastName ILIKE :search', { search: `%${search}%` })
            .orWhere('user.email ILIKE :search', { search: `%${search}%` })
            .orWhere('user.middleName ILIKE :search', {
              search: `%${search}%`,
            });
        }),
      );
    }

    // Фильтр по активности
    if (isActive !== undefined) {
      queryBuilder.andWhere('user.isActive = :isActive', { isActive });
    }

    // Фильтр по верификации
    if (isVerified !== undefined) {
      queryBuilder.andWhere('user.isVerified = :isVerified', { isVerified });
    }

    // Фильтр по роли
    if (role) {
      queryBuilder.andWhere('roles.name = :role', { role });
    }

    // Фильтр по агентству
    if (agencyId) {
      queryBuilder.andWhere('user.agencyId = :agencyId', { agencyId });
    }

    // Сортировка
    const allowedSortFields = ['firstName', 'lastName', 'email', 'createdAt'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    queryBuilder.orderBy(`user.${sortField}`, sortOrder);

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
}
