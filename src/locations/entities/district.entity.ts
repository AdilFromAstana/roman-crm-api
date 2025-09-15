// src/locations/entities/district.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { City } from './city.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Index(['name', 'cityId'])
export class District {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Медеуский', description: 'Название района' })
  @Column()
  name: string;

  @ApiProperty({ example: 43.2389, description: 'Широта' })
  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @ApiProperty({ example: 76.8877, description: 'Долгота' })
  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @ApiProperty({ example: true, description: 'Активен' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'ID города' })
  @Column()
  cityId: number;

  @ManyToOne(() => City, (city) => city.districts)
  city: City;
}
