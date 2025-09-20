// sales/sales.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { Sale } from './entities/sale.entity';
import { BringCarsModule } from '../bring-cars/bring-cars.module';
import { CustomersModule } from '../customers/customers.module';
import { EmployeesModule } from '../employees/employees.module';
import { SalesStatusesModule } from '../sales-statuses/sales-statuses.module';
import { EmployeeIncomesModule } from '../employee-incomes/employee-incomes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale]),
    BringCarsModule,
    CustomersModule,
    EmployeesModule,
    SalesStatusesModule,
    forwardRef(() => EmployeeIncomesModule),
  ],
  controllers: [SalesController],
  providers: [SalesService],
  exports: [SalesService, TypeOrmModule],
})
export class SalesModule {}
