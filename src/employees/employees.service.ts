// employees/employees.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeePositionsService } from '../employee-positions/employee-positions.service';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,
    private readonly employeePositionsService: EmployeePositionsService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    // Проверяем существование позиций по кодам
    if (
      createEmployeeDto.positionCodes &&
      createEmployeeDto.positionCodes.length > 0
    ) {
      await this.validatePositionCodes(createEmployeeDto.positionCodes);
    }

    const employee = this.employeesRepository.create({
      ...createEmployeeDto,
      positionCodes: createEmployeeDto.positionCodes || [],
      isActive: createEmployeeDto.isActive ?? true,
    });

    return this.employeesRepository.save(employee);
  }

  async findAll(): Promise<Employee[]> {
    return this.employeesRepository.find({
      order: { lastName: 'ASC', firstName: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeesRepository.findOne({
      where: { id },
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    const employee = await this.findOne(id);

    // Проверяем существование позиций если они обновляются
    if (updateEmployeeDto.positionCodes !== undefined) {
      if (
        updateEmployeeDto.positionCodes &&
        updateEmployeeDto.positionCodes.length > 0
      ) {
        await this.validatePositionCodes(updateEmployeeDto.positionCodes);
      }
      employee.positionCodes = updateEmployeeDto.positionCodes || [];
    }

    Object.assign(employee, updateEmployeeDto);
    return this.employeesRepository.save(employee);
  }

  async remove(id: string): Promise<void> {
    const employee = await this.findOne(id);
    await this.employeesRepository.remove(employee);
  }

  async toggleActive(id: string): Promise<Employee> {
    const employee = await this.findOne(id);
    employee.isActive = !employee.isActive;
    return this.employeesRepository.save(employee);
  }

  // Валидация кодов позиций
  private async validatePositionCodes(positionCodes: string[]): Promise<void> {
    const errors: string[] = [];

    for (const code of positionCodes) {
      try {
        await this.employeePositionsService.findOneByCode(code);
      } catch (error) {
        errors.push(`Позиция с кодом "${code}" не найдена`);
      }
    }

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Ошибки валидации позиций',
        errors: errors,
      });
    }
  }
}
