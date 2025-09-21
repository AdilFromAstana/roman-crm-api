// bring-car-statuses/entities/bring-car-status.entity.ts
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { BringCar } from '../../bring-cars/entities/bring-car.entity';

@Entity('bring_car_statuses')
export class BringCarStatus {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Связь с загнанными автомобилями
  @OneToMany(() => BringCar, (bringCar) => bringCar.bringCarStatusCode)
  bringCars: BringCar[];
}
