// bring-cars/entities/bring-car.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Brand } from '../../brands/entities/brand.entity';
import { Model } from '../../models/entities/model.entity';
import { Color } from '../../colors/entities/color.entity';
import { FuelType } from '../../fuel-types/entities/fuel-type.entity';
import { Transmission } from '../../transmissions/entities/transmission.entity';
import { Employee } from '../../employees/entities/employee.entity';
import { BringCarImage } from '../../bring-car-images/entities/bring-car-image.entity';
import { SalesStatus } from '../../sales-statuses/entities/sales-status.entity';

@Entity('bring_cars')
export class BringCar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  brandCode: string;

  @ManyToOne(() => Brand, { eager: true }) // Добавляем eager
  @JoinColumn({ name: 'brandCode', referencedColumnName: 'code' })
  brand: Brand;

  @Column({ type: 'varchar', length: 50 })
  modelCode: string;

  @ManyToOne(() => Model, { eager: true })
  @JoinColumn({ name: 'modelCode', referencedColumnName: 'code' })
  model: Model;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  salePrice: number;

  @Column({ type: 'int' })
  mileage: number;

  @Column({ type: 'varchar', length: 50 })
  colorCode: string;

  @ManyToOne(() => Color, { eager: true })
  @JoinColumn({ name: 'colorCode', referencedColumnName: 'code' })
  color: Color;

  @Column({ type: 'varchar', length: 50 })
  fuelTypeCode: string;

  @ManyToOne(() => FuelType, { eager: true })
  @JoinColumn({ name: 'fuelTypeCode', referencedColumnName: 'code' })
  fuelType: FuelType;

  @Column({ type: 'varchar', length: 50 })
  transmissionCode: string;

  @ManyToOne(() => Transmission, { eager: true })
  @JoinColumn({ name: 'transmissionCode', referencedColumnName: 'code' })
  transmission: Transmission;

  // Особенности (массив кодов)
  @Column({ type: 'simple-array' })
  featureCodes: string[];

  // Описание
  @Column({ type: 'text', nullable: true })
  description: string;

  // Сотрудник и дата загона
  @Column({ type: 'uuid' })
  bringEmployeeId: string;

  @ManyToOne(() => Employee, { eager: true })
  @JoinColumn({ name: 'bringEmployeeId' })
  bringEmployee: Employee;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  // Статус и даты
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdDatabaseAt: Date;

  @UpdateDateColumn()
  updatedDatabaseAt: Date;

  @OneToMany(() => BringCarImage, (image) => image.bringCar, { eager: true })
  images: BringCarImage[];
}
