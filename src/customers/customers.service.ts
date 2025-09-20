// customers/customers.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { TrafficSourcesService } from '../traffic-sources/traffic-sources.service';
import { CustomerStatusesService } from '../customer-statuses/customer-statuses.service';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,

    @Inject(forwardRef(() => TrafficSourcesService))
    private readonly trafficSourcesService: TrafficSourcesService,

    @Inject(forwardRef(() => CustomerStatusesService))
    private readonly customerStatusesService: CustomerStatusesService,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    // Проверяем существование связанных сущностей
    await this.validateRelatedEntities(createCustomerDto);

    const customer = this.customersRepository.create({
      ...createCustomerDto,
      tags: createCustomerDto.tags || [],
      isActive: createCustomerDto.isActive ?? true,
    });
    return this.customersRepository.save(customer);
  }

  async findAll(): Promise<Customer[]> {
    return this.customersRepository.find({
      order: { lastName: 'ASC', firstName: 'ASC' },
      relations: ['trafficSource', 'customerStatus'],
    });
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customersRepository.findOne({
      where: { id },
      relations: ['trafficSource', 'customerStatus'],
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async findOneByPhone(phone: string): Promise<Customer> {
    const customer = await this.customersRepository.findOne({
      where: { phone },
      relations: ['trafficSource', 'customerStatus'],
    });
    if (!customer) {
      throw new NotFoundException(`Customer with phone ${phone} not found`);
    }
    return customer;
  }

  async findOneByEmail(email: string): Promise<Customer> {
    const customer = await this.customersRepository.findOne({
      where: { email },
      relations: ['trafficSource', 'customerStatus'],
    });
    if (!customer) {
      throw new NotFoundException(`Customer with email ${email} not found`);
    }
    return customer;
  }

  async findOneByIin(iin: string): Promise<Customer> {
    const customer = await this.customersRepository.findOne({
      where: { iin },
      relations: ['trafficSource', 'customerStatus'],
    });
    if (!customer) {
      throw new NotFoundException(`Customer with IIN ${iin} not found`);
    }
    return customer;
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const customer = await this.findOne(id);

    // Проверяем существование связанных сущностей если они обновляются
    if (this.hasRelatedEntityUpdates(updateCustomerDto)) {
      await this.validateRelatedEntities({
        ...customer,
        ...updateCustomerDto,
      } as CreateCustomerDto);
    }

    Object.assign(customer, updateCustomerDto);
    return this.customersRepository.save(customer);
  }

  async remove(id: string): Promise<void> {
    const customer = await this.findOne(id);
    await this.customersRepository.remove(customer);
  }

  async toggleActive(id: string): Promise<Customer> {
    const customer = await this.findOne(id);
    customer.isActive = !customer.isActive;
    return this.customersRepository.save(customer);
  }

  // Валидация связанных сущностей с максимально подробными ошибками
  private async validateRelatedEntities(
    dto: CreateCustomerDto | UpdateCustomerDto,
  ): Promise<void> {
    const validationErrors: string[] = [];

    // Проверяем источник трафика
    if (dto.trafficSourceCode) {
      try {
        const trafficSource = await this.trafficSourcesService.findOneByCode(
          dto.trafficSourceCode,
        );
        if (!trafficSource.isActive) {
          validationErrors.push(
            `Источник трафика "${dto.trafficSourceCode}" не активен`,
          );
        }
      } catch (error) {
        validationErrors.push(
          `Источник трафика с кодом "${dto.trafficSourceCode}" не существует`,
        );
      }
    }

    // Проверяем статус клиента
    if (dto.customerStatusCode) {
      try {
        const customerStatus = await this.customerStatusesService.findOneByCode(
          dto.customerStatusCode,
        );
        if (!customerStatus.isActive) {
          validationErrors.push(
            `Статус клиента "${dto.customerStatusCode}" не активен`,
          );
        }
      } catch (error) {
        validationErrors.push(
          `Статус клиента с кодом "${dto.customerStatusCode}" не существует`,
        );
      }
    }

    // Проверяем уровень прогрева
    if (dto.warmingLevel !== undefined) {
      if (dto.warmingLevel < 1 || dto.warmingLevel > 5) {
        validationErrors.push(
          `Уровень прогрева должен быть от 1 до 5, получено: ${dto.warmingLevel}`,
        );
      }
    }

    // Проверяем ИИН если указан
    if (dto.iin) {
      const iinRegex = /^\d{12}$/;
      if (!iinRegex.test(dto.iin)) {
        validationErrors.push(`ИИН должен содержать ровно 12 цифр`);
      }
    }

    // Проверяем телефон если указан
    if (dto.phone) {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(dto.phone)) {
        validationErrors.push(`Неверный формат телефона: ${dto.phone}`);
      }
    }

    // Проверяем email если указан
    if (dto.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(dto.email)) {
        validationErrors.push(`Неверный формат email: ${dto.email}`);
      }
    }

    if (validationErrors.length > 0) {
      throw new BadRequestException({
        message: 'Валидация данных клиента не пройдена',
        errors: validationErrors,
      });
    }
  }

  private hasRelatedEntityUpdates(dto: UpdateCustomerDto): boolean {
    return !!(dto.trafficSourceCode || dto.customerStatusCode);
  }
}
