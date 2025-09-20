import { BringCar } from 'src/bring-cars/entities/bring-car.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('bring_car_images')
@Index(['bringCarId'])
export class BringCarImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 500 })
  url: string;

  @Column({ type: 'uuid' })
  bringCarId: string;

  @Column({ type: 'int', default: 0 })
  order: number; // Порядок отображения

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => BringCar, (bringCar) => bringCar.images)
  @JoinColumn({ name: 'bringCarId' })
  bringCar: BringCar;
}
