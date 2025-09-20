// customers/entities/customer.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TrafficSource } from '../../traffic-sources/entities/traffic-source.entity';
import { CustomerStatus } from '../../customer-statuses/entities/customer-status.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  firstName: string;

  @Column({ type: 'varchar', length: 50 })
  lastName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  middleName: string;

  @Column({ type: 'varchar', length: 12, unique: true, nullable: true })
  iin: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  address: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  // Связи по кодам
  @Column({ type: 'varchar', length: 50, nullable: true })
  trafficSourceCode: string;

  @ManyToOne(() => TrafficSource, { nullable: true })
  @JoinColumn({ name: 'trafficSourceCode', referencedColumnName: 'code' })
  trafficSource: TrafficSource;

  @Column({ type: 'int', nullable: true })
  warmingLevel: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  customerStatusCode: string;

  @ManyToOne(() => CustomerStatus, { nullable: true })
  @JoinColumn({ name: 'customerStatusCode', referencedColumnName: 'code' })
  customerStatus: CustomerStatus;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
