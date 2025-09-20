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

// sales/entities/sale.entity.ts
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
  saleEmployeeId: string; // Сотрудник-продавец

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'saleEmployeeId' })
  saleEmployee: Employee;

  @Column({ type: 'uuid' })
  bringEmployeeId: string; // Сотрудник, загнавший авто

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'bringEmployeeId' })
  bringEmployee: Employee;

  @Column({ type: 'uuid', nullable: true })
  managerEmployeeId: string; // Менеджер (опционально)

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'managerEmployeeId' })
  managerEmployee: Employee;

  // Финансовая информация
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  purchasePrice: number; // Цена загона (из BringCar)

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  salePrice: number; // Цена продажи

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  netProfit: number; // Чистая прибыль (salePrice - purchasePrice)

  // Бонусы (конкретные суммы)
  @Column({ type: 'decimal', precision: 15, scale: 2 })
  saleEmployeeBonus: number; // Бонус продавца (конкретная сумма)

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  bringEmployeeBonus: number; // Бонус загнавшего (конкретная сумма)

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  managerEmployeeBonus: number; // Бонус менеджера (конкретная сумма)

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalBonuses: number; // Общая сумма бонусов

  // Статус продажи
  @Column({ type: 'varchar', length: 50 })
  salesStatusCode: string; // ON_APPROVAL, ON_PROCESSING, SOLD, etc.

  @ManyToOne(() => SalesStatus)
  @JoinColumn({ name: 'salesStatusCode', referencedColumnName: 'code' })
  salesStatus: SalesStatus;

  @Column({ type: 'boolean', default: false })
  isCommissionPaid: boolean; // Выплачены ли все бонусы

  // Даты
  @Column({ type: 'timestamp' })
  saleDate: Date; // Дата продажи

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
