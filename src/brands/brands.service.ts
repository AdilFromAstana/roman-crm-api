import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandsRepository: Repository<Brand>,
  ) {}

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    const brand = this.brandsRepository.create({
      ...createBrandDto,
      isActive: createBrandDto.isActive ?? true,
    });
    return this.brandsRepository.save(brand);
  }

  async findAll(): Promise<Brand[]> {
    return this.brandsRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Brand> {
    const brand = await this.brandsRepository.findOne({ where: { id } });
    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }
    return brand;
  }

  async findOneByCode(code: string): Promise<Brand> {
    const brand = await this.brandsRepository.findOne({ where: { code } });
    if (!brand) {
      throw new NotFoundException(`Brand with code ${code} not found`);
    }
    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    const brand = await this.findOne(id);
    Object.assign(brand, updateBrandDto);
    return this.brandsRepository.save(brand);
  }

  async remove(id: string): Promise<void> {
    const brand = await this.findOne(id);
    await this.brandsRepository.remove(brand);
  }

  async toggleActive(id: string): Promise<Brand> {
    const brand = await this.findOne(id);
    brand.isActive = !brand.isActive;
    return this.brandsRepository.save(brand);
  }
}
