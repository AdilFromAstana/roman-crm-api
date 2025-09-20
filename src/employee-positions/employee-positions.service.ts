import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { EmployeePosition } from './entities/employee-position.entity';
import { CreateEmployeePositionDto } from './dto/create-employee-position.dto';
import { UpdateEmployeePositionDto } from './dto/update-employee-position.dto';

@Injectable()
export class EmployeePositionsService {
  constructor(
    @InjectRepository(EmployeePosition)
    private readonly employeePositionsRepository: Repository<EmployeePosition>,
  ) {}

  async create(
    createEmployeePositionDto: CreateEmployeePositionDto,
  ): Promise<EmployeePosition> {
    const position = this.employeePositionsRepository.create({
      ...createEmployeePositionDto,
      isActive: createEmployeePositionDto.isActive ?? true,
    });
    return this.employeePositionsRepository.save(position);
  }

  async findAll(): Promise<EmployeePosition[]> {
    return this.employeePositionsRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<EmployeePosition> {
    const position = await this.employeePositionsRepository.findOne({
      where: { id },
    });
    if (!position) {
      throw new NotFoundException(`Employee position with ID ${id} not found`);
    }
    return position;
  }

  async findOneByCode(code: string): Promise<EmployeePosition> {
    const position = await this.employeePositionsRepository.findOne({
      where: { code },
    });
    if (!position) {
      throw new NotFoundException(
        `Employee position with code ${code} not found`,
      );
    }
    return position;
  }

  async findByIds(ids: string[]): Promise<EmployeePosition[]> {
    return this.employeePositionsRepository.findBy({
      id: In(ids),
    });
  }

  async update(
    id: string,
    updateEmployeePositionDto: UpdateEmployeePositionDto,
  ): Promise<EmployeePosition> {
    const position = await this.findOne(id);
    Object.assign(position, updateEmployeePositionDto);
    return this.employeePositionsRepository.save(position);
  }

  async remove(id: string): Promise<void> {
    const position = await this.findOne(id);
    await this.employeePositionsRepository.remove(position);
  }

  async toggleActive(id: string): Promise<EmployeePosition> {
    const position = await this.findOne(id);
    position.isActive = !position.isActive;
    return this.employeePositionsRepository.save(position);
  }
}
