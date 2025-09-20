import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Color } from './entities/color.entity';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';

@Injectable()
export class ColorsService {
  constructor(
    @InjectRepository(Color)
    private readonly colorsRepository: Repository<Color>,
  ) {}

  async create(createColorDto: CreateColorDto): Promise<Color> {
    const color = this.colorsRepository.create({
      ...createColorDto,
      isActive: createColorDto.isActive ?? true,
    });
    return this.colorsRepository.save(color);
  }

  async findAll(): Promise<Color[]> {
    return this.colorsRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Color> {
    const color = await this.colorsRepository.findOne({ where: { id } });
    if (!color) {
      throw new NotFoundException(`Color with ID ${id} not found`);
    }
    return color;
  }

  async findOneByCode(code: string): Promise<Color> {
    const color = await this.colorsRepository.findOne({ where: { code } });
    if (!color) {
      throw new NotFoundException(`Color with code ${code} not found`);
    }
    return color;
  }

  async update(id: string, updateColorDto: UpdateColorDto): Promise<Color> {
    const color = await this.findOne(id);
    Object.assign(color, updateColorDto);
    return this.colorsRepository.save(color);
  }

  async remove(id: string): Promise<void> {
    const color = await this.findOne(id);
    await this.colorsRepository.remove(color);
  }

  async toggleActive(id: string): Promise<Color> {
    const color = await this.findOne(id);
    color.isActive = !color.isActive;
    return this.colorsRepository.save(color);
  }
}
