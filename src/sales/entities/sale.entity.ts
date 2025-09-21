// sales/entities/sale.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { BringCar } from '../../bring-cars/entities/bring-car.entity';
import { Customer } from '../../customers/entities/customer.entity';
import { Employee } from '../../employees/entities/employee.entity';
import { SalesStatus } from '../../sales-statuses/entities/sales-status.entity';
import { SaleStatus } from '../enums/sale-status.enum'; // Добавляем импорт

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  bringCarId: string;

  @OneToOne(() => BringCar)
  @JoinColumn({ name: 'bringCarId' })
  bringCar: BringCar;

  @Column({ type: 'uuid' })
  customerId: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  // Сотрудники участвующие в продаже
  @Column({ type: 'uuid' })
  saleEmployeeId: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'saleEmployeeId' })
  saleEmployee: Employee;

  @Column({ type: 'uuid' })
  bringEmployeeId: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'bringEmployeeId' })
  bringEmployee: Employee;

  @Column({ type: 'uuid', nullable: true })
  managerEmployeeId: string;

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'managerEmployeeId' })
  managerEmployee: Employee;

  // Финансовая информация
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  purchasePrice: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  salePrice: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  netProfit: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  saleEmployeeBonus: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  bringEmployeeBonus: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  managerEmployeeBonus: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  totalBonuses: number;

  // Статус продажи
  @Column({
    type: 'varchar',
    length: 50,
  })
  salesStatusCode: string;

  @ManyToOne(() => SalesStatus)
  @JoinColumn({ name: 'salesStatusCode', referencedColumnName: 'code' })
  salesStatus: SalesStatus;

  @Column({ type: 'boolean', default: false })
  isCommissionPaid: boolean;

  // Даты
  @Column({ type: 'timestamp' })
  saleDate: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
