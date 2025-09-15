// src/locations/locations.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './entities/city.entity';
import { District } from './entities/district.entity';
import { CreateCityDto } from './dto/create-city.dto';
import { CreateDistrictDto } from './dto/create-district.dto';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(City)
    private citiesRepository: Repository<City>,
    @InjectRepository(District)
    private districtsRepository: Repository<District>,
  ) {}

  // Города
  async createCity(createCityDto: CreateCityDto): Promise<City> {
    const existingCity = await this.citiesRepository.findOne({
      where: { name: createCityDto.name, country: createCityDto.country },
    });

    if (existingCity) {
      throw new BadRequestException(
        'Город с таким названием в этой стране уже существует',
      );
    }

    const city = this.citiesRepository.create({
      ...createCityDto,
      isActive:
        createCityDto.isActive !== undefined ? createCityDto.isActive : true,
    });

    return this.citiesRepository.save(city);
  }

  async findAllCities(): Promise<City[]> {
    return this.citiesRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findCityById(id: number): Promise<City> {
    const city = await this.citiesRepository.findOne({ where: { id } });
    if (!city) {
      throw new BadRequestException('Город не найден');
    }
    return city;
  }

  async updateCity(
    id: number,
    updateCityDto: Partial<CreateCityDto>,
  ): Promise<City> {
    const city = await this.findCityById(id);
    Object.assign(city, updateCityDto);
    return this.citiesRepository.save(city);
  }

  // Районы
  async createDistrict(
    createDistrictDto: CreateDistrictDto,
  ): Promise<District> {
    const city = await this.citiesRepository.findOne({
      where: { id: createDistrictDto.cityId },
    });
    if (!city) {
      throw new BadRequestException('Город не найден');
    }

    const existingDistrict = await this.districtsRepository.findOne({
      where: { name: createDistrictDto.name, cityId: createDistrictDto.cityId },
    });

    if (existingDistrict) {
      throw new BadRequestException(
        'Район с таким названием в этом городе уже существует',
      );
    }

    const district = this.districtsRepository.create({
      ...createDistrictDto,
      isActive:
        createDistrictDto.isActive !== undefined
          ? createDistrictDto.isActive
          : true,
    });

    return this.districtsRepository.save(district);
  }

  async findAllDistricts(cityId?: number): Promise<District[]> {
    const where: any = { isActive: true };
    if (cityId) {
      where.cityId = cityId;
    }

    return this.districtsRepository.find({
      where,
      order: { name: 'ASC' },
      relations: ['city'],
    });
  }

  async findDistrictById(id: number): Promise<District> {
    const district = await this.districtsRepository.findOne({
      where: { id },
      relations: ['city'],
    });
    if (!district) {
      throw new BadRequestException('Район не найден');
    }
    return district;
  }

  async findDistrictsByCity(cityId: number): Promise<District[]> {
    return this.districtsRepository.find({
      where: { cityId, isActive: true },
      order: { name: 'ASC' },
    });
  }

  async updateDistrict(
    id: number,
    updateDistrictDto: Partial<CreateDistrictDto>,
  ): Promise<District> {
    const district = await this.findDistrictById(id);

    if (updateDistrictDto.cityId) {
      const city = await this.citiesRepository.findOne({
        where: { id: updateDistrictDto.cityId },
      });
      if (!city) {
        throw new BadRequestException('Город не найден');
      }
    }

    Object.assign(district, updateDistrictDto);
    return this.districtsRepository.save(district);
  }
}
