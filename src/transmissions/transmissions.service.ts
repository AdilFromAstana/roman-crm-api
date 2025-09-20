import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transmission } from './entities/transmission.entity';
import { CreateTransmissionDto } from './dto/create-transmission.dto';
import { UpdateTransmissionDto } from './dto/update-transmission.dto';

@Injectable()
export class TransmissionsService {
  constructor(
    @InjectRepository(Transmission)
    private readonly transmissionsRepository: Repository<Transmission>,
  ) {}

  async create(
    createTransmissionDto: CreateTransmissionDto,
  ): Promise<Transmission> {
    const transmission = this.transmissionsRepository.create({
      ...createTransmissionDto,
      isActive: createTransmissionDto.isActive ?? true,
    });
    return this.transmissionsRepository.save(transmission);
  }

  async findAll(): Promise<Transmission[]> {
    return this.transmissionsRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Transmission> {
    const transmission = await this.transmissionsRepository.findOne({
      where: { id },
    });
    if (!transmission) {
      throw new NotFoundException(`Transmission with ID ${id} not found`);
    }
    return transmission;
  }

  async findOneByCode(code: string): Promise<Transmission> {
    const transmission = await this.transmissionsRepository.findOne({
      where: { code },
    });
    if (!transmission) {
      throw new NotFoundException(`Transmission with code ${code} not found`);
    }
    return transmission;
  }

  async update(
    id: string,
    updateTransmissionDto: UpdateTransmissionDto,
  ): Promise<Transmission> {
    const transmission = await this.findOne(id);
    Object.assign(transmission, updateTransmissionDto);
    return this.transmissionsRepository.save(transmission);
  }

  async remove(id: string): Promise<void> {
    const transmission = await this.findOne(id);
    await this.transmissionsRepository.remove(transmission);
  }

  async toggleActive(id: string): Promise<Transmission> {
    const transmission = await this.findOne(id);
    transmission.isActive = !transmission.isActive;
    return this.transmissionsRepository.save(transmission);
  }
}
