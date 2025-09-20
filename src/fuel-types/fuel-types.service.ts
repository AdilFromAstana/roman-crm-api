import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FuelType } from './entities/fuel-type.entity';
import { CreateFuelTypeDto } from './dto/create-fuel-type.dto';
import { UpdateFuelTypeDto } from './dto/update-fuel-type.dto';

@Injectable()
export class FuelTypesService {
  constructor(
    @InjectRepository(FuelType)
    private readonly fuelTypesRepository: Repository<FuelType>,
  ) {}

  async create(createFuelTypeDto: CreateFuelTypeDto): Promise<FuelType> {
    const fuelType = this.fuelTypesRepository.create({
      ...createFuelTypeDto,
      isActive: createFuelTypeDto.isActive ?? true,
    });
    return this.fuelTypesRepository.save(fuelType);
  }

  async findAll(): Promise<FuelType[]> {
    return this.fuelTypesRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<FuelType> {
    const fuelType = await this.fuelTypesRepository.findOne({ where: { id } });
    if (!fuelType) {
      throw new NotFoundException(`Fuel type with ID ${id} not found`);
    }
    return fuelType;
  }

  async findOneByCode(code: string): Promise<FuelType> {
    const fuelType = await this.fuelTypesRepository.findOne({
      where: { code },
    });
    if (!fuelType) {
      throw new NotFoundException(`Fuel type with code ${code} not found`);
    }
    return fuelType;
  }

  async update(
    id: string,
    updateFuelTypeDto: UpdateFuelTypeDto,
  ): Promise<FuelType> {
    const fuelType = await this.findOne(id);
    Object.assign(fuelType, updateFuelTypeDto);
    return this.fuelTypesRepository.save(fuelType);
  }

  async remove(id: string): Promise<void> {
    const fuelType = await this.findOne(id);
    await this.fuelTypesRepository.remove(fuelType);
  }

  async toggleActive(id: string): Promise<FuelType> {
    const fuelType = await this.findOne(id);
    fuelType.isActive = !fuelType.isActive;
    return this.fuelTypesRepository.save(fuelType);
  }
}
