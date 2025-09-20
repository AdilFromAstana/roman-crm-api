import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeIncomesService } from './employee-incomes.service';
import { EmployeeIncomesController } from './employee-incomes.controller';
import { EmployeeIncome } from './entities/employee-income.entity';
import { EmployeesModule } from '../employees/employees.module';
import { SalesModule } from 'src/sales/sales.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployeeIncome]),
    EmployeesModule,
    forwardRef(() => SalesModule),
  ],
  controllers: [EmployeeIncomesController],
  providers: [EmployeeIncomesService],
  exports: [EmployeeIncomesService, TypeOrmModule],
})
export class EmployeeIncomesModule {}
