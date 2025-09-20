// bring-cars/bring-cars.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BringCar } from './entities/bring-car.entity';
import { CreateBringCarDto } from './dto/create-bring-car.dto';
import { UpdateBringCarDto } from './dto/update-bring-car.dto';
import { BringCarImagesService } from '../bring-car-images/bring-car-images.service';
import { BrandsService } from '../brands/brands.service';
import { ModelsService } from '../models/models.service';
import { ColorsService } from '../colors/colors.service';
import { FuelTypesService } from '../fuel-types/fuel-types.service';
import { TransmissionsService } from '../transmissions/transmissions.service';
import { EmployeesService } from '../employees/employees.service';
import { FeaturesService } from '../features/features.service';
import { SalesStatusesService } from '../sales-statuses/sales-statuses.service';
import { BringCarResponseDto } from './dto/bring-car-response.dto';

@Injectable()
export class BringCarsService {
  constructor(
    @InjectRepository(BringCar)
    private readonly bringCarsRepository: Repository<BringCar>,

    @Inject(forwardRef(() => BringCarImagesService))
    private readonly bringCarImagesService: BringCarImagesService,

    private readonly brandsService: BrandsService,
    private readonly modelsService: ModelsService,
    private readonly colorsService: ColorsService,
    private readonly fuelTypesService: FuelTypesService,
    private readonly transmissionsService: TransmissionsService,
    private readonly employeesService: EmployeesService,
    private readonly featuresService: FeaturesService,

    @Inject(forwardRef(() => SalesStatusesService))
    private readonly salesStatusesService: SalesStatusesService,
  ) {}

  async create(
    createBringCarDto: CreateBringCarDto,
  ): Promise<BringCarResponseDto> {
    // Проверяем существование всех связанных сущностей
    await this.validateRelatedEntities(createBringCarDto);

    const bringCar = this.bringCarsRepository.create({
      ...createBringCarDto,
      featureCodes: createBringCarDto.featureCodes || [],
      isActive: createBringCarDto.isActive ?? true,
    });

    const savedCar = await this.bringCarsRepository.save(bringCar);

    // Создаем изображения если они переданы
    if (createBringCarDto.imageUrls && createBringCarDto.imageUrls.length > 0) {
      for (let i = 0; i < createBringCarDto.imageUrls.length; i++) {
        await this.bringCarImagesService.create({
          url: createBringCarDto.imageUrls[i],
          bringCarId: savedCar.id,
          order: i,
        });
      }
    }

    // Возвращаем Response DTO
    const fullCar = await this.bringCarsRepository.findOne({
      where: { id: savedCar.id },
    });

    // Добавляем проверку на null
    if (!fullCar) {
      throw new NotFoundException(
        `BringCar with ID ${savedCar.id} not found after creation`,
      );
    }

    return this.mapToResponseDto(fullCar);
  }

  async findAll(): Promise<BringCarResponseDto[]> {
    const cars = await this.bringCarsRepository.find({
      order: { createdAt: 'DESC' },
    });

    return cars.map((car) => this.mapToResponseDto(car));
  }

  async findOne(id: string): Promise<BringCarResponseDto> {
    const car = await this.bringCarsRepository.findOne({
      where: { id },
    });

    if (!car) {
      throw new NotFoundException(`BringCar with ID ${id} not found`);
    }

    return this.mapToResponseDto(car);
  }

  async findByEmployee(bringEmployeeId: string): Promise<BringCar[]> {
    return this.bringCarsRepository.find({
      where: { bringEmployeeId },
      order: { createdAt: 'DESC' },
      relations: [
        'brand',
        'model',
        'color',
        'fuelType',
        'transmission',
        'bringEmployee',
      ],
    });
  }

  async update(
    id: string,
    updateBringCarDto: UpdateBringCarDto,
  ): Promise<BringCarResponseDto> {
    // Получаем оригинальную сущность
    const bringCar = await this.bringCarsRepository.findOne({
      where: { id },
    });

    if (!bringCar) {
      throw new NotFoundException(`BringCar with ID ${id} not found`);
    }

    // Проверяем существование связанных сущностей если они обновляются
    if (this.hasRelatedEntityUpdates(updateBringCarDto)) {
      await this.validateRelatedEntities({
        ...bringCar,
        ...updateBringCarDto,
      } as CreateBringCarDto);
    }

    Object.assign(bringCar, updateBringCarDto);
    const updatedCar = await this.bringCarsRepository.save(bringCar);

    // Возвращаем Response DTO
    return this.mapToResponseDto(updatedCar);
  }

  async remove(id: string): Promise<void> {
    // Получаем оригинальную сущность, а не Response DTO
    const bringCar = await this.bringCarsRepository.findOne({
      where: { id },
    });

    if (!bringCar) {
      throw new NotFoundException(`BringCar with ID ${id} not found`);
    }

    // Удаляем связанные изображения
    await this.bringCarImagesService.deleteByBringCar(id);

    // Удаляем сам автомобиль
    await this.bringCarsRepository.remove(bringCar);
  }

  async toggleActive(id: string): Promise<BringCarResponseDto> {
    // Получаем оригинальную сущность
    const bringCar = await this.bringCarsRepository.findOne({
      where: { id },
    });

    if (!bringCar) {
      throw new NotFoundException(`BringCar with ID ${id} not found`);
    }

    bringCar.isActive = !bringCar.isActive;
    const updatedCar = await this.bringCarsRepository.save(bringCar);

    // Возвращаем Response DTO
    return this.mapToResponseDto(updatedCar);
  }

  // Валидация связанных сущностей с детальными ошибками
  private async validateRelatedEntities(
    dto: CreateBringCarDto | UpdateBringCarDto,
  ): Promise<void> {
    const errors: string[] = [];

    try {
      // Проверяем справочные сущности по кодам
      if (dto.brandCode) {
        try {
          await this.brandsService.findOneByCode(dto.brandCode);
        } catch (error) {
          errors.push(`Марка с кодом "${dto.brandCode}" не найдена`);
        }
      }

      if (dto.modelCode) {
        try {
          await this.modelsService.findOneByCode(dto.modelCode);
        } catch (error) {
          errors.push(`Модель с кодом "${dto.modelCode}" не найдена`);
        }
      }

      if (dto.colorCode) {
        try {
          await this.colorsService.findOneByCode(dto.colorCode);
        } catch (error) {
          errors.push(`Цвет с кодом "${dto.colorCode}" не найден`);
        }
      }

      if (dto.fuelTypeCode) {
        try {
          await this.fuelTypesService.findOneByCode(dto.fuelTypeCode);
        } catch (error) {
          errors.push(`Тип топлива с кодом "${dto.fuelTypeCode}" не найден`);
        }
      }

      if (dto.transmissionCode) {
        try {
          await this.transmissionsService.findOneByCode(dto.transmissionCode);
        } catch (error) {
          errors.push(
            `Коробка передач с кодом "${dto.transmissionCode}" не найдена`,
          );
        }
      }

      if (dto.bringEmployeeId) {
        try {
          await this.employeesService.findOne(dto.bringEmployeeId);
        } catch (error) {
          errors.push(`Сотрудник с ID "${dto.bringEmployeeId}" не найден`);
        }
      }

      // Проверяем существование feature codes
      if (dto.featureCodes && dto.featureCodes.length > 0) {
        for (const code of dto.featureCodes) {
          try {
            await this.featuresService.findOneByCode(code);
          } catch (error) {
            errors.push(`Особенность с кодом "${code}" не найдена`);
          }
        }
      }

      // Если есть ошибки, выбрасываем исключение с деталями
      if (errors.length > 0) {
        throw new BadRequestException({
          message: 'Ошибки валидации связанных сущностей',
          errors: errors,
        });
      }
    } catch (error) {
      // Если это уже наше исключение, пробрасываем его
      if (error instanceof BadRequestException) {
        throw error;
      }
      // Иначе выбрасываем общее исключение
      throw new BadRequestException('Ошибка валидации связанных сущностей');
    }
  }

  // Исправленный метод hasRelatedEntityUpdates:
  private hasRelatedEntityUpdates(dto: UpdateBringCarDto): boolean {
    return !!(
      dto.brandCode ||
      dto.modelCode ||
      dto.colorCode ||
      dto.fuelTypeCode ||
      dto.transmissionCode ||
      dto.bringEmployeeId ||
      (dto.featureCodes && dto.featureCodes.length > 0)
    );
  }

  private mapToResponseDto(car: BringCar): BringCarResponseDto {
    return {
      id: car.id,
      brandCode: car.brandCode,
      brand: {
        code: car.brand.code,
        name: car.brand.name,
      },
      modelCode: car.modelCode,
      model: {
        code: car.model.code,
        name: car.model.name,
      },
      year: car.year,
      price: car.price,
      salePrice: car.salePrice,
      mileage: car.mileage,
      colorCode: car.colorCode,
      color: {
        code: car.color.code,
        name: car.color.name,
      },
      fuelTypeCode: car.fuelTypeCode,
      fuelType: {
        code: car.fuelType.code,
        name: car.fuelType.name,
      },
      transmissionCode: car.transmissionCode,
      transmission: {
        code: car.transmission.code,
        name: car.transmission.name,
      },
      featureCodes: car.featureCodes,
      description: car.description,
      bringEmployeeId: car.bringEmployeeId,
      bringEmployee: {
        id: car.bringEmployee.id,
        firstName: car.bringEmployee.firstName,
        lastName: car.bringEmployee.lastName,
        positionCodes: car.bringEmployee.positionCodes,
      },
      createdAt: car.createdAt,
      isActive: car.isActive,
      images: car.images.map((image) => ({
        id: image.id,
        url: image.url,
        order: image.order,
      })),
    };
  }
}
