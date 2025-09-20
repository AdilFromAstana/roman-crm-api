import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Model } from './entities/model.entity';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { BrandsService } from '../brands/brands.service';

@Injectable()
export class ModelsService {
  constructor(
    @InjectRepository(Model)
    private readonly modelsRepository: Repository<Model>,
    private readonly brandsService: BrandsService,
  ) {}

  async create(createModelDto: CreateModelDto): Promise<Model> {
    // Проверяем существование бренда
    await this.brandsService.findOne(createModelDto.brandId);

    const model = this.modelsRepository.create({
      ...createModelDto,
      isActive: createModelDto.isActive ?? true,
    });
    return this.modelsRepository.save(model);
  }

  async findAll(): Promise<Model[]> {
    return this.modelsRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Model> {
    const model = await this.modelsRepository.findOne({
      where: { id },
      relations: ['brand'],
    });
    if (!model) {
      throw new NotFoundException(`Model with ID ${id} not found`);
    }
    return model;
  }

  async findOneByCode(code: string): Promise<Model> {
    const model = await this.modelsRepository.findOne({
      where: { code },
      relations: ['brand'],
    });
    if (!model) {
      throw new NotFoundException(`Model with code ${code} not found`);
    }
    return model;
  }

  async findByBrand(brandId: string): Promise<Model[]> {
    return this.modelsRepository.find({
      where: { brandId },
      order: { name: 'ASC' },
    });
  }

  async update(id: string, updateModelDto: UpdateModelDto): Promise<Model> {
    const model = await this.findOne(id);

    if (updateModelDto.brandId) {
      await this.brandsService.findOne(updateModelDto.brandId);
    }

    Object.assign(model, updateModelDto);
    return this.modelsRepository.save(model);
  }

  async remove(id: string): Promise<void> {
    const model = await this.findOne(id);
    await this.modelsRepository.remove(model);
  }

  async toggleActive(id: string): Promise<Model> {
    const model = await this.findOne(id);
    model.isActive = !model.isActive;
    return this.modelsRepository.save(model);
  }
}
