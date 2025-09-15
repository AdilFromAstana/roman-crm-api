// src/locations/entities/city.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from 'typeorm';
import { District } from './district.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Index(['name', 'country'])
export class City {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Алматы', description: 'Название города' })
  @Column()
  name: string;

  @ApiProperty({ example: 'Казахстан', description: 'Страна' })
  @Column()
  country: string;

  @ApiProperty({ example: 'ALA', description: 'Код города' })
  @Column({ nullable: true })
  code: string;

  @ApiProperty({ example: 43.222, description: 'Широта' })
  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @ApiProperty({ example: 76.8512, description: 'Долгота' })
  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @ApiProperty({ example: true, description: 'Активен' })
  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => District, (district) => district.city)
  districts: District[];
}
