import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { BringCarImage } from './entities/bring-car-image.entity';
import { CreateBringCarImageDto } from './dto/create-bring-car-image.dto';
import { UpdateBringCarImageDto } from './dto/update-bring-car-image.dto';

@Injectable()
export class BringCarImagesService {
  constructor(
    @InjectRepository(BringCarImage)
    private readonly bringCarImagesRepository: Repository<BringCarImage>,
  ) {}

  async create(
    createBringCarImageDto: CreateBringCarImageDto,
  ): Promise<BringCarImage> {
    // Автоматически устанавливаем порядок, если не указан
    let order = createBringCarImageDto.order ?? 0;
    if (createBringCarImageDto.order === undefined) {
      const existingImages = await this.findByBringCar(
        createBringCarImageDto.bringCarId,
      );
      order = existingImages.length;
    }

    const image = this.bringCarImagesRepository.create({
      ...createBringCarImageDto,
      order,
      isActive: createBringCarImageDto.isActive ?? true,
    });
    return this.bringCarImagesRepository.save(image);
  }

  async findAll(): Promise<BringCarImage[]> {
    return this.bringCarImagesRepository.find({
      order: { order: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<BringCarImage> {
    const image = await this.bringCarImagesRepository.findOne({
      where: { id },
    });
    if (!image) {
      throw new NotFoundException(`BringCarImage with ID ${id} not found`);
    }
    return image;
  }

  async findByBringCar(bringCarId: string): Promise<BringCarImage[]> {
    return this.bringCarImagesRepository.find({
      where: { bringCarId, isActive: true },
      order: { order: 'ASC', createdAt: 'DESC' },
    });
  }

  async findByBringCars(bringCarIds: string[]): Promise<BringCarImage[]> {
    return this.bringCarImagesRepository.find({
      where: {
        bringCarId: In(bringCarIds),
        isActive: true,
      },
      order: { order: 'ASC', createdAt: 'DESC' },
    });
  }

  async update(
    id: string,
    updateBringCarImageDto: UpdateBringCarImageDto,
  ): Promise<BringCarImage> {
    const image = await this.findOne(id);
    Object.assign(image, updateBringCarImageDto);
    return this.bringCarImagesRepository.save(image);
  }

  async remove(id: string): Promise<void> {
    const image = await this.findOne(id);
    await this.bringCarImagesRepository.remove(image);
  }

  async toggleActive(id: string): Promise<BringCarImage> {
    const image = await this.findOne(id);
    image.isActive = !image.isActive;
    return this.bringCarImagesRepository.save(image);
  }

  async updateOrder(id: string, order: number): Promise<BringCarImage> {
    const image = await this.findOne(id);
    image.order = order;
    return this.bringCarImagesRepository.save(image);
  }

  async deleteByBringCar(bringCarId: string): Promise<void> {
    await this.bringCarImagesRepository.delete({ bringCarId });
  }

  async reorderImages(
    bringCarId: string,
    imageIds: string[],
  ): Promise<BringCarImage[]> {
    const images = await this.bringCarImagesRepository.findBy({
      id: In(imageIds),
      bringCarId,
    });

    const updatedImages = imageIds
      .map((imageId, index) => {
        const image = images.find((img) => img.id === imageId);
        if (image) {
          image.order = index;
          return image;
        }
        return null;
      })
      .filter(Boolean) as BringCarImage[];

    return this.bringCarImagesRepository.save(updatedImages);
  }
}
