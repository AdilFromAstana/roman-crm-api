import {
  Injectable,
  NotFoundException,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { CustomerInteraction } from './entities/customer-interaction.entity';
import { CreateCustomerInteractionDto } from './dto/create-customer-interaction.dto';
import { UpdateCustomerInteractionDto } from './dto/update-customer-interaction.dto';
import { CustomersService } from '../customers/customers.service';
import { EmployeesService } from '../employees/employees.service';

@Injectable()
export class CustomerInteractionsService {
  constructor(
    @InjectRepository(CustomerInteraction)
    private readonly customerInteractionsRepository: Repository<CustomerInteraction>,

    @Inject(forwardRef(() => CustomersService))
    private readonly customersService: CustomersService,

    @Inject(forwardRef(() => EmployeesService))
    private readonly employeesService: EmployeesService,
  ) {}

  async create(
    createCustomerInteractionDto: CreateCustomerInteractionDto,
  ): Promise<CustomerInteraction> {
    // Проверяем существование связанных сущностей
    await this.validateRelatedEntities(createCustomerInteractionDto);

    const interaction = this.customerInteractionsRepository.create({
      ...createCustomerInteractionDto,
      isActive: createCustomerInteractionDto.isActive ?? true,
    });

    const savedInteraction =
      await this.customerInteractionsRepository.save(interaction);

    // Автоматически увеличиваем уровень прогрева клиента
    await this.updateCustomerWarmingLevel(
      createCustomerInteractionDto.customerId,
    );

    return this.findOne(savedInteraction.id);
  }

  async findAll(): Promise<CustomerInteraction[]> {
    return this.customerInteractionsRepository.find({
      order: { interactionDate: 'DESC' },
      relations: ['customer', 'employee'],
    });
  }

  async findOne(id: string): Promise<CustomerInteraction> {
    const interaction = await this.customerInteractionsRepository.findOne({
      where: { id },
      relations: ['customer', 'employee'],
    });
    if (!interaction) {
      throw new NotFoundException(
        `Customer interaction with ID ${id} not found`,
      );
    }
    return interaction;
  }

  async findByCustomer(customerId: string): Promise<CustomerInteraction[]> {
    return this.customerInteractionsRepository.find({
      where: { customerId },
      order: { interactionDate: 'DESC' },
      relations: ['employee'],
    });
  }

  async findByEmployee(employeeId: string): Promise<CustomerInteraction[]> {
    return this.customerInteractionsRepository.find({
      where: { employeeId },
      order: { interactionDate: 'DESC' },
      relations: ['customer'],
    });
  }

  async findUpcomingInteractions(
    days: number = 7,
  ): Promise<CustomerInteraction[]> {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);

    return this.customerInteractionsRepository.find({
      where: {
        nextActionDate: Between(now, futureDate),
        isActive: true,
      },
      order: { nextActionDate: 'ASC' },
      relations: ['customer', 'employee'],
    });
  }

  async update(
    id: string,
    updateCustomerInteractionDto: UpdateCustomerInteractionDto,
  ): Promise<CustomerInteraction> {
    const interaction = await this.findOne(id);

    // Проверяем существование связанных сущностей если они обновляются
    if (this.hasRelatedEntityUpdates(updateCustomerInteractionDto)) {
      await this.validateRelatedEntities({
        ...interaction,
        ...updateCustomerInteractionDto,
      } as CreateCustomerInteractionDto);
    }

    Object.assign(interaction, updateCustomerInteractionDto);
    return this.customerInteractionsRepository.save(interaction);
  }

  async remove(id: string): Promise<void> {
    const interaction = await this.findOne(id);
    await this.customerInteractionsRepository.remove(interaction);
  }

  async toggleActive(id: string): Promise<CustomerInteraction> {
    const interaction = await this.findOne(id);
    interaction.isActive = !interaction.isActive;
    return this.customerInteractionsRepository.save(interaction);
  }

  // Валидация связанных сущностей
  private async validateRelatedEntities(
    dto: CreateCustomerInteractionDto,
  ): Promise<void> {
    try {
      await this.customersService.findOne(dto.customerId);

      if (dto.employeeId) {
        await this.employeesService.findOne(dto.employeeId);
      }
    } catch (error) {
      throw new BadRequestException(
        'Одна или несколько связанных сущностей не найдены',
      );
    }
  }

  private hasRelatedEntityUpdates(dto: UpdateCustomerInteractionDto): boolean {
    return !!(dto.customerId || dto.employeeId);
  }

  // Автоматическое обновление уровня прогрева клиента
  private async updateCustomerWarmingLevel(customerId: string): Promise<void> {
    try {
      const customer = await this.customersService.findOne(customerId);
      const interactions = await this.findByCustomer(customerId);

      // Уровень прогрева от 1 до 5, зависит от количества взаимодействий
      const warmingLevel = Math.min(5, Math.max(1, interactions.length));

      if (customer.warmingLevel !== warmingLevel) {
        await this.customersService.update(customerId, { warmingLevel });
      }
    } catch (error) {
      // Не критично, если не удалось обновить уровень прогрева
      console.warn('Не удалось обновить уровень прогрева клиента:', error);
    }
  }
}
