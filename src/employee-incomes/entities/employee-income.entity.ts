import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';
import { Sale } from '../../sales/entities/sale.entity';

@Entity('employee_incomes')
export class EmployeeIncome {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  employeeId: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column({ type: 'uuid', nullable: true })
  saleId: string;

  @ManyToOne(() => Sale, { nullable: true })
  @JoinColumn({ name: 'saleId' })
  sale: Sale;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  incomeAmount: number;

  @Column({
    type: 'varchar',
    length: 50,
    enum: ['SALE_BONUS', 'COMMISSION', 'OTHER'],
  })
  incomeType: 'SALE_BONUS' | 'COMMISSION' | 'OTHER';

  @Column({ type: 'varchar', length: 200, nullable: true })
  description: string;

  @Column({ type: 'boolean', default: false })
  isPaid: boolean;

  @Column({ type: 'timestamp', nullable: true })
  paidDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
