import {
  Injectable,
  NotFoundException,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeIncome } from './entities/employee-income.entity';
import { CreateEmployeeIncomeDto } from './dto/create-employee-income.dto';
import { UpdateEmployeeIncomeDto } from './dto/update-employee-income.dto';
import { EmployeesService } from '../employees/employees.service';
import { SalesService } from 'src/sales/sales.service';

@Injectable()
export class EmployeeIncomesService {
  constructor(
    @InjectRepository(EmployeeIncome)
    private readonly employeeIncomesRepository: Repository<EmployeeIncome>,

    private readonly employeesService: EmployeesService,
    
    @Inject(forwardRef(() => SalesService))
    private readonly salesService: SalesService,
  ) {}

  async create(
    createEmployeeIncomeDto: CreateEmployeeIncomeDto,
  ): Promise<EmployeeIncome> {
    // Проверяем существование связанных сущностей
    await this.validateRelatedEntities(createEmployeeIncomeDto);

    const income = this.employeeIncomesRepository.create({
      ...createEmployeeIncomeDto,
      isPaid: createEmployeeIncomeDto.isPaid ?? false,
    });

    return this.employeeIncomesRepository.save(income);
  }

  async findAll(): Promise<EmployeeIncome[]> {
    return this.employeeIncomesRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['employee', 'sale'],
    });
  }

  async findOne(id: string): Promise<EmployeeIncome> {
    const income = await this.employeeIncomesRepository.findOne({
      where: { id },
      relations: ['employee', 'sale'],
    });

    if (!income) {
      throw new NotFoundException(`Employee income with ID ${id} not found`);
    }

    return income;
  }

  async findByEmployee(employeeId: string): Promise<EmployeeIncome[]> {
    return this.employeeIncomesRepository.find({
      where: { employeeId },
      order: { createdAt: 'DESC' },
      relations: ['employee', 'sale'],
    });
  }

  async findBySale(saleId: string): Promise<EmployeeIncome[]> {
    return this.employeeIncomesRepository.find({
      where: { saleId },
      order: { createdAt: 'DESC' },
      relations: ['employee', 'sale'],
    });
  }

  async findByType(
    incomeType: 'SALE_BONUS' | 'COMMISSION' | 'OTHER',
  ): Promise<EmployeeIncome[]> {
    return this.employeeIncomesRepository.find({
      where: { incomeType },
      order: { createdAt: 'DESC' },
      relations: ['employee', 'sale'],
    });
  }

  async findByPaymentStatus(isPaid: boolean): Promise<EmployeeIncome[]> {
    return this.employeeIncomesRepository.find({
      where: { isPaid },
      order: { createdAt: 'DESC' },
      relations: ['employee', 'sale'],
    });
  }

  async update(
    id: string,
    updateEmployeeIncomeDto: UpdateEmployeeIncomeDto,
  ): Promise<EmployeeIncome> {
    const income = await this.findOne(id);

    // Проверяем существование связанных сущностей если они обновляются
    if (this.hasRelatedEntityUpdates(updateEmployeeIncomeDto)) {
      await this.validateRelatedEntities(updateEmployeeIncomeDto);
    }

    Object.assign(income, updateEmployeeIncomeDto);
    return this.employeeIncomesRepository.save(income);
  }

  async remove(id: string): Promise<void> {
    const income = await this.findOne(id);
    await this.employeeIncomesRepository.remove(income);
  }

  async togglePaidStatus(id: string): Promise<EmployeeIncome> {
    const income = await this.findOne(id);
    income.isPaid = !income.isPaid;
    if (income.isPaid && !income.paidDate) {
      income.paidDate = new Date();
    }
    return this.employeeIncomesRepository.save(income);
  }

  // Статистика по доходам
  async getEmployeeIncomeStats(employeeId: string): Promise<any> {
    const incomes = await this.findByEmployee(employeeId);

    const totalIncome = incomes.reduce(
      (sum, income) => sum + income.incomeAmount,
      0,
    );
    const paidIncome = incomes
      .filter((income) => income.isPaid)
      .reduce((sum, income) => sum + income.incomeAmount, 0);
    const pendingIncome = totalIncome - paidIncome;

    return {
      totalIncome,
      paidIncome,
      pendingIncome,
      totalCount: incomes.length,
    };
  }

  async getCompanyIncomeStats(): Promise<any> {
    const allIncomes = await this.findAll();

    const totalIncome = allIncomes.reduce(
      (sum, income) => sum + income.incomeAmount,
      0,
    );
    const paidIncome = allIncomes
      .filter((income) => income.isPaid)
      .reduce((sum, income) => sum + income.incomeAmount, 0);
    const pendingIncome = totalIncome - paidIncome;

    // Группировка по типам доходов
    const incomeByType = {
      SALE_BONUS: allIncomes
        .filter((income) => income.incomeType === 'SALE_BONUS')
        .reduce((sum, income) => sum + income.incomeAmount, 0),
      COMMISSION: allIncomes
        .filter((income) => income.incomeType === 'COMMISSION')
        .reduce((sum, income) => sum + income.incomeAmount, 0),
      OTHER: allIncomes
        .filter((income) => income.incomeType === 'OTHER')
        .reduce((sum, income) => sum + income.incomeAmount, 0),
    };

    return {
      totalIncome,
      paidIncome,
      pendingIncome,
      incomeByType,
      totalCount: allIncomes.length,
    };
  }

  // Валидация связанных сущностей
  private async validateRelatedEntities(
    dto: CreateEmployeeIncomeDto | UpdateEmployeeIncomeDto,
  ): Promise<void> {
    try {
      await this.employeesService.findOne(dto.employeeId!);

      if (dto.saleId) {
        await this.salesService.findOne(dto.saleId);
      }
    } catch (error) {
      throw new BadRequestException(
        'Одна или несколько связанных сущностей не найдены',
      );
    }
  }

  private hasRelatedEntityUpdates(dto: UpdateEmployeeIncomeDto): boolean {
    return !!(dto.employeeId || dto.saleId);
  }
}
