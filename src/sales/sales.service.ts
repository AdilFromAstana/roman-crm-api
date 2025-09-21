// sales/sales.service.ts
import {
  Injectable,
  NotFoundException,
  forwardRef,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { SalesValidators } from './sales.validators';
import { SalesHelpers } from './sales.helpers';
import { SalesStatusHandlers } from './sales.status-handlers';
import { SalesIncomeProcessors } from './sales.income-processors';
import { BringCarsService } from 'src/bring-cars/bring-cars.service';
import { CustomersService } from 'src/customers/customers.service';
import { EmployeesService } from 'src/employees/employees.service';
import { SalesStatusesService } from 'src/sales-statuses/sales-statuses.service';
import { EmployeeIncomesService } from 'src/employee-incomes/employee-incomes.service';
import { SaleStatus } from './enums/sale-status.enum';

@Injectable()
export class SalesService {
  private readonly validators: SalesValidators;
  private readonly helpers: SalesHelpers;
  private readonly statusHandlers: SalesStatusHandlers;
  private readonly incomeProcessors: SalesIncomeProcessors;

  constructor(
    @InjectRepository(Sale)
    private readonly salesRepository: Repository<Sale>,

    private readonly dataSource: DataSource,
    private readonly bringCarsService: BringCarsService,
    private readonly customersService: CustomersService,
    private readonly employeesService: EmployeesService,
    private readonly salesStatusesService: SalesStatusesService,

    @Inject(forwardRef(() => EmployeeIncomesService))
    private readonly employeeIncomesService: EmployeeIncomesService,
  ) {
    // Инициализируем вспомогательные классы
    this.validators = new SalesValidators(
      this.bringCarsService,
      this.customersService,
      this.employeesService,
      this.salesStatusesService,
    );

    this.helpers = new SalesHelpers(this.salesRepository);
    this.statusHandlers = new SalesStatusHandlers(this.salesRepository);
    this.incomeProcessors = new SalesIncomeProcessors();
  }

  // CRUD операции
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

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Проверяем существование всех связанных сущностей
      await this.validators.validateRelatedEntities(createSaleDto);
      await this.helpers.checkCarSaleStatus(createSaleDto.bringCarId);

      // Валидируем бонусы
      this.validators.validateBonusAmounts(
        createSaleDto,
        createSaleDto.salePrice,
        createSaleDto.purchasePrice,
      );

      // Создаем продажу
      const sale = queryRunner.manager.create(Sale, {
        ...createSaleDto,
        netProfit: createSaleDto.salePrice - createSaleDto.purchasePrice,
        saleDate: new Date(createSaleDto.saleDate),
        salesStatusCode: SaleStatus.ON_APPROVAL,
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

  // sales/sales.service.ts
  async update(id: string, updateSaleDto: UpdateSaleDto): Promise<Sale> {
    console.log(`Частичное обновление продажи ID: ${id}`);

    return this.dataSource.transaction(async (manager) => {
      // Получаем текущую продажу
      const sale = await manager.findOne(Sale, {
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

      console.log('Текущая продажа:', {
        id: sale.id,
        currentStatus: sale.salesStatusCode,
        currentPrice: sale.salePrice,
      });

      // Фильтруем только переданные поля
      const updateFields: Partial<Sale> = {};
      const updatedFieldNames: string[] = [];

      Object.keys(updateSaleDto).forEach((key) => {
        if (updateSaleDto[key] !== undefined) {
          updateFields[key] = updateSaleDto[key];
          updatedFieldNames.push(key);
        }
      });

      console.log('Обновляемые поля:', updatedFieldNames);

      // Проверки только для переданных полей
      if (
        updatedFieldNames.some((field) =>
          [
            'bringCarId',
            'customerId',
            'saleEmployeeId',
            'bringEmployeeId',
            'managerEmployeeId',
          ].includes(field),
        )
      ) {
        console.log('Проверяем связанные сущности...');
        await this.validators.validateRelatedEntities(updateSaleDto);
      }

      // Проверка смены статуса
      const newStatus = updateSaleDto.salesStatusCode;
      const oldStatus = sale.salesStatusCode;

      if (newStatus && newStatus !== oldStatus) {
        console.log('Проверяем валидацию статуса...', { oldStatus, newStatus });
        await this.statusHandlers.validateStatusRequirements(
          sale,
          updateSaleDto,
        );
      }

      // Валидация бонусов только если переданы бонусные поля
      if (
        updatedFieldNames.some((field) =>
          [
            'saleEmployeeBonus',
            'bringEmployeeBonus',
            'managerEmployeeBonus',
            'totalBonuses',
            'salePrice',
            'purchasePrice',
          ].includes(field),
        )
      ) {
        console.log('Валидируем бонусы...');
        const salePrice =
          updateSaleDto.salePrice !== undefined
            ? updateSaleDto.salePrice
            : sale.salePrice;
        const purchasePrice =
          updateSaleDto.purchasePrice !== undefined
            ? updateSaleDto.purchasePrice
            : sale.purchasePrice;

        this.validators.validateBonusAmounts(
          updateSaleDto,
          salePrice,
          purchasePrice,
        );
      }

      if (newStatus === SaleStatus.SOLD && oldStatus !== SaleStatus.SOLD) {
        console.log('Обновляем статус загнанного автомобиля на SOLD...');

        try {
          // Обновляем статус через сервис
          await this.bringCarsService.updateBringCarStatus(
            sale.bringCarId,
            'SOLD',
          );

          console.log(`Статус автомобиля ${sale.bringCarId} обновлен на SOLD`);
        } catch (error) {
          console.error('Ошибка при обновлении статуса автомобиля:', error);
          throw new BadRequestException(
            'Не удалось обновить статус загнанного автомобиля',
          );
        }
      }

      // Специальная обработка для статусов
      if (
        newStatus === SaleStatus.BONUSES_ISSUED &&
        oldStatus !== SaleStatus.BONUSES_ISSUED
      ) {
        console.log('Создаем записи доходов для бонусов...');

        // Обновляем сущность для передачи в income processor
        Object.assign(sale, updateFields);
        if (updateSaleDto.saleDate) {
          sale.saleDate = new Date(updateSaleDto.saleDate);
        }

        // Создаем записи доходов
        await this.incomeProcessors.createEmployeeIncomeRecordsWithManager(
          manager,
          sale,
        );
      }

      if (
        newStatus === SaleStatus.COMMISSION_ISSUED &&
        oldStatus !== SaleStatus.COMMISSION_ISSUED
      ) {
        console.log('Отмечаем выплату комиссии...');
        updateFields.isCommissionPaid = true;
      }

      // Выполняем частичное обновление только переданных полей
      console.log('Выполняем частичное обновление...');
      await manager.update(Sale, id, updateFields);

      // Получаем обновленную сущность
      const updatedSale = await manager.findOne(Sale, {
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

      if (!updatedSale) {
        throw new NotFoundException(
          `Sale with ID ${id} not found after update`,
        );
      }

      console.log('Финальная сущность:', {
        id: updatedSale.id,
        status: updatedSale.salesStatusCode,
        price: updatedSale.salePrice,
      });

      return updatedSale;
    });
  }

  async getSalesStats(): Promise<any> {
    const allSales = await this.findAll();

    const totalSales = allSales.length;
    const totalRevenue = allSales.reduce(
      (sum, sale) => sum + sale.salePrice,
      0,
    );
    const totalProfit = allSales.reduce((sum, sale) => sum + sale.netProfit, 0);
    const totalBonuses = allSales.reduce(
      (sum, sale) => sum + (sale.totalBonuses || 0),
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
}
