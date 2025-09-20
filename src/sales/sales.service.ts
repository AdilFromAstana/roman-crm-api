import {
  Injectable,
  NotFoundException,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { BringCarsService } from '../bring-cars/bring-cars.service';
import { CustomersService } from '../customers/customers.service';
import { EmployeesService } from '../employees/employees.service';
import { SalesStatusesService } from '../sales-statuses/sales-statuses.service';
import { EmployeeIncomesService } from '../employee-incomes/employee-incomes.service';
import { EmployeeIncome } from '../employee-incomes/entities/employee-income.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly salesRepository: Repository<Sale>,

    private readonly dataSource: DataSource, // Добавляем DataSource

    private readonly bringCarsService: BringCarsService,
    private readonly customersService: CustomersService,
    private readonly employeesService: EmployeesService,
    private readonly salesStatusesService: SalesStatusesService,

    @Inject(forwardRef(() => EmployeeIncomesService))
    private readonly employeeIncomesService: EmployeeIncomesService,
  ) {}

  async findAll(): Promise<Sale[]> {
    return this.salesRepository.find({
      order: { saleDate: 'DESC' },
      relations: [
        'bringCar',
        'customer',
        'saleEmployee',
        'bringEmployee',
        'managerEmployee',
        'salesStatus',
      ],
    });
  }

  async findOne(id: string): Promise<Sale> {
    const sale = await this.salesRepository.findOne({
      where: { id },
      relations: [
        'bringCar',
        'customer',
        'saleEmployee',
        'bringEmployee',
        'managerEmployee',
        'salesStatus',
      ],
    });

    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    return sale;
  }

  async findOneByBringCar(bringCarId: string): Promise<Sale> {
    const sale = await this.salesRepository.findOne({
      where: { bringCarId },
      relations: [
        'bringCar',
        'customer',
        'saleEmployee',
        'bringEmployee',
        'managerEmployee',
        'salesStatus',
      ],
    });

    if (!sale) {
      throw new NotFoundException(
        `Sale for BringCar with ID ${bringCarId} not found`,
      );
    }

    return sale;
  }

  async remove(id: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const sale = await this.findOne(id);
      await queryRunner.manager.remove(sale);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async toggleActive(id: string): Promise<Sale> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const sale = await this.findOne(id);
      sale.isActive = !sale.isActive;
      const updatedSale = await queryRunner.manager.save(sale);

      await queryRunner.commitTransaction();
      return updatedSale;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Валидация бонусов
  private validateBonusAmounts(saleDto: CreateSaleDto | UpdateSaleDto): void {
    const saleEmployeeBonus = saleDto.saleEmployeeBonus || 0;
    const bringEmployeeBonus = saleDto.bringEmployeeBonus || 0;
    const managerEmployeeBonus = saleDto.managerEmployeeBonus || 0;
    const netProfit = saleDto.netProfit || 0;
    const totalBonuses = saleDto.totalBonuses || 0;

    const calculatedTotal =
      saleEmployeeBonus + bringEmployeeBonus + managerEmployeeBonus;

    if (calculatedTotal > netProfit) {
      throw new BadRequestException(
        'Сумма бонусов не может превышать чистую прибыль',
      );
    }

    if (calculatedTotal !== totalBonuses) {
      throw new BadRequestException(
        'Общая сумма бонусов не соответствует сумме отдельных бонусов',
      );
    }
  }

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Проверяем существование всех связанных сущностей
      await this.validateRelatedEntities(createSaleDto);

      // Валидируем бонусы
      this.validateBonusAmounts(createSaleDto);

      // Создаем продажу
      const sale = queryRunner.manager.create(Sale, {
        ...createSaleDto,
        salesStatusCode: 'ON_APPROVAL', // Начальный статус
        isCommissionPaid: false,
        isActive: createSaleDto.isActive ?? true,
      });

      const savedSale = await queryRunner.manager.save(sale);

      await queryRunner.commitTransaction();
      return this.findOne(savedSale.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: string, updateSaleDto: UpdateSaleDto): Promise<Sale> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const sale = await this.findOne(id);

      // Проверяем существование связанных сущностей если они обновляются
      if (this.hasRelatedEntityUpdates(updateSaleDto)) {
        await this.validateRelatedEntities({
          ...sale,
          ...updateSaleDto,
        } as CreateSaleDto);
      }

      // Валидируем бонусы если они обновляются
      if (
        updateSaleDto.saleEmployeeBonus !== undefined ||
        updateSaleDto.bringEmployeeBonus !== undefined ||
        updateSaleDto.managerEmployeeBonus !== undefined ||
        updateSaleDto.totalBonuses !== undefined ||
        updateSaleDto.netProfit !== undefined
      ) {
        const bonusDto = {
          ...sale,
          ...updateSaleDto,
        } as CreateSaleDto;

        this.validateBonusAmounts(bonusDto);
      }

      // Если меняется статус на BONUSES_ISSUED, создаем записи доходов
      if (
        updateSaleDto.salesStatusCode === 'BONUSES_ISSUED' &&
        sale.salesStatusCode !== 'BONUSES_ISSUED'
      ) {
        await this.createEmployeeIncomeRecordsWithManager(
          queryRunner.manager,
          sale,
        );
      }

      Object.assign(sale, updateSaleDto);
      const updatedSale = await queryRunner.manager.save(sale);

      await queryRunner.commitTransaction();
      return this.findOne(updatedSale.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Создание записей доходов сотрудников с использованием менеджера из транзакции
  private async createEmployeeIncomeRecordsWithManager(
    manager: any,
    sale: Sale,
  ): Promise<void> {
    try {
      // Бонус продавца
      if (sale.saleEmployeeBonus > 0) {
        const income = manager.create(EmployeeIncome, {
          employeeId: sale.saleEmployeeId,
          saleId: sale.id,
          incomeAmount: sale.saleEmployeeBonus,
          incomeType: 'SALE_BONUS',
          description: `Бонус за продажу ${sale.bringCar.brandCode} ${sale.bringCar.modelCode}`,
        });
        await manager.save(income);
      }

      // Бонус загнавшего
      if (sale.bringEmployeeBonus > 0) {
        const income = manager.create(EmployeeIncome, {
          employeeId: sale.bringEmployeeId,
          saleId: sale.id,
          incomeAmount: sale.bringEmployeeBonus,
          incomeType: 'SALE_BONUS',
          description: `Бонус за загон ${sale.bringCar.brandCode} ${sale.bringCar.modelCode}`,
        });
        await manager.save(income);
      }

      // Бонус менеджера (если есть)
      if (sale.managerEmployeeId && sale.managerEmployeeBonus > 0) {
        const income = manager.create(EmployeeIncome, {
          employeeId: sale.managerEmployeeId,
          saleId: sale.id,
          incomeAmount: sale.managerEmployeeBonus,
          incomeType: 'SALE_BONUS',
          description: `Бонус менеджера за продажу ${sale.bringCar.brandCode} ${sale.bringCar.modelCode}`,
        });
        await manager.save(income);
      }
    } catch (error) {
      console.error('Ошибка при создании записей доходов:', error);
      throw error; // Пробрасываем ошибку для rollback
    }
  }

  // Статистика продаж
  async getSalesStats(): Promise<any> {
    const allSales = await this.findAll();

    const totalSales = allSales.length;
    const totalRevenue = allSales.reduce(
      (sum, sale) => sum + sale.salePrice,
      0,
    );
    const totalProfit = allSales.reduce((sum, sale) => sum + sale.netProfit, 0);
    const totalBonuses = allSales.reduce(
      (sum, sale) => sum + sale.totalBonuses,
      0,
    );

    // Группировка по статусам
    const statusStats: Record<string, number> = {};
    allSales.forEach((sale) => {
      const status = sale.salesStatusCode;
      statusStats[status] = (statusStats[status] || 0) + 1;
    });

    return {
      totalSales,
      totalRevenue,
      totalProfit,
      totalBonuses,
      statusStats,
    };
  }

  // Валидация связанных сущностей
  private async validateRelatedEntities(
    dto: CreateSaleDto | UpdateSaleDto,
  ): Promise<void> {
    try {
      if (dto.bringCarId) await this.bringCarsService.findOne(dto.bringCarId);
      if (dto.customerId) await this.customersService.findOne(dto.customerId);
      if (dto.saleEmployeeId)
        await this.employeesService.findOne(dto.saleEmployeeId);
      if (dto.bringEmployeeId)
        await this.employeesService.findOne(dto.bringEmployeeId);

      if (dto.managerEmployeeId) {
        await this.employeesService.findOne(dto.managerEmployeeId);
      }

      // Проверяем статус если он указан
      const updateDto = dto as UpdateSaleDto;
      if (updateDto.salesStatusCode) {
        await this.salesStatusesService.findOneByCode(
          updateDto.salesStatusCode,
        );
      }
    } catch (error) {
      throw new BadRequestException(
        'Одна или несколько связанных сущностей не найдены',
      );
    }
  }

  private hasRelatedEntityUpdates(dto: UpdateSaleDto): boolean {
    return !!(
      dto.bringCarId ||
      dto.customerId ||
      dto.saleEmployeeId ||
      dto.bringEmployeeId ||
      dto.managerEmployeeId ||
      dto.salesStatusCode
    );
  }
}
