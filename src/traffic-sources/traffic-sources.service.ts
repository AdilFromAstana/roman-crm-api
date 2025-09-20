import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrafficSource } from './entities/traffic-source.entity';
import { CreateTrafficSourceDto } from './dto/create-traffic-source.dto';
import { UpdateTrafficSourceDto } from './dto/update-traffic-source.dto';

@Injectable()
export class TrafficSourcesService {
  constructor(
    @InjectRepository(TrafficSource)
    private readonly trafficSourcesRepository: Repository<TrafficSource>,
  ) {}

  async create(
    createTrafficSourceDto: CreateTrafficSourceDto,
  ): Promise<TrafficSource> {
    const trafficSource = this.trafficSourcesRepository.create({
      ...createTrafficSourceDto,
      sortOrder: createTrafficSourceDto.sortOrder ?? 0,
      isActive: createTrafficSourceDto.isActive ?? true,
    });
    return this.trafficSourcesRepository.save(trafficSource);
  }

  async findAll(): Promise<TrafficSource[]> {
    return this.trafficSourcesRepository.find({
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<TrafficSource> {
    const trafficSource = await this.trafficSourcesRepository.findOne({
      where: { id },
    });
    if (!trafficSource) {
      throw new NotFoundException(`Traffic source with ID ${id} not found`);
    }
    return trafficSource;
  }

  async findOneByCode(code: string): Promise<TrafficSource> {
    const trafficSource = await this.trafficSourcesRepository.findOne({
      where: { code },
    });
    if (!trafficSource) {
      throw new NotFoundException(`Traffic source with code ${code} not found`);
    }
    return trafficSource;
  }

  async update(
    id: string,
    updateTrafficSourceDto: UpdateTrafficSourceDto,
  ): Promise<TrafficSource> {
    const trafficSource = await this.findOne(id);
    Object.assign(trafficSource, updateTrafficSourceDto);
    return this.trafficSourcesRepository.save(trafficSource);
  }

  async remove(id: string): Promise<void> {
    const trafficSource = await this.findOne(id);
    await this.trafficSourcesRepository.remove(trafficSource);
  }

  async toggleActive(id: string): Promise<TrafficSource> {
    const trafficSource = await this.findOne(id);
    trafficSource.isActive = !trafficSource.isActive;
    return this.trafficSourcesRepository.save(trafficSource);
  }

  // Сиды для стандартных источников
  async createDefaultSources(): Promise<TrafficSource[]> {
    const defaultSources = [
      { code: 'INSTAGRAM', name: 'Instagram', icon: 'instagram', sortOrder: 1 },
      { code: 'FACEBOOK', name: 'Facebook', icon: 'facebook', sortOrder: 2 },
      { code: 'VK', name: 'ВКонтакте', icon: 'vk', sortOrder: 3 },
      { code: 'GOOGLE_ADS', name: 'Google Ads', icon: 'google', sortOrder: 4 },
      { code: 'YANDEX', name: 'Яндекс Директ', icon: 'yandex', sortOrder: 5 },
      { code: 'REFERRAL', name: 'Реферал', icon: 'user', sortOrder: 6 },
      { code: 'DIRECT', name: 'Прямой заход', icon: 'direct', sortOrder: 7 },
      { code: 'OTHER', name: 'Другое', icon: 'other', sortOrder: 8 },
    ];

    const existingSources = await this.findAll();
    const newSources: TrafficSource[] = [];

    for (const sourceData of defaultSources) {
      const exists = existingSources.find((s) => s.code === sourceData.code);
      if (!exists) {
        const source = this.trafficSourcesRepository.create({
          ...sourceData,
          isActive: true,
        });
        const savedSource = await this.trafficSourcesRepository.save(source);
        newSources.push(savedSource);
      }
    }

    return newSources;
  }
}
