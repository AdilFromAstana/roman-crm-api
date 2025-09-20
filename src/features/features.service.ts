import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feature } from './entities/feature.entity';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';

@Injectable()
export class FeaturesService {
  constructor(
    @InjectRepository(Feature)
    private readonly featuresRepository: Repository<Feature>,
  ) {}

  async create(createFeatureDto: CreateFeatureDto): Promise<Feature> {
    const feature = this.featuresRepository.create({
      ...createFeatureDto,
      isActive: createFeatureDto.isActive ?? true,
    });
    return this.featuresRepository.save(feature);
  }

  async findAll(): Promise<Feature[]> {
    return this.featuresRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Feature> {
    const feature = await this.featuresRepository.findOne({ where: { id } });
    if (!feature) {
      throw new NotFoundException(`Feature with ID ${id} not found`);
    }
    return feature;
  }

  async findOneByCode(code: string): Promise<Feature> {
    const feature = await this.featuresRepository.findOne({ where: { code } });
    if (!feature) {
      throw new NotFoundException(`Feature with code ${code} not found`);
    }
    return feature;
  }

  async update(
    id: string,
    updateFeatureDto: UpdateFeatureDto,
  ): Promise<Feature> {
    const feature = await this.findOne(id);
    Object.assign(feature, updateFeatureDto);
    return this.featuresRepository.save(feature);
  }

  async remove(id: string): Promise<void> {
    const feature = await this.findOne(id);
    await this.featuresRepository.remove(feature);
  }

  async toggleActive(id: string): Promise<Feature> {
    const feature = await this.findOne(id);
    feature.isActive = !feature.isActive;
    return this.featuresRepository.save(feature);
  }
}
