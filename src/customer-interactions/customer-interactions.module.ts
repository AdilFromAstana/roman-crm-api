import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerInteractionsService } from './customer-interactions.service';
import { CustomerInteractionsController } from './customer-interactions.controller';
import { CustomerInteraction } from './entities/customer-interaction.entity';
import { CustomersModule } from '../customers/customers.module';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerInteraction]),
    forwardRef(() => CustomersModule),
    forwardRef(() => EmployeesModule),
  ],
  controllers: [CustomerInteractionsController],
  providers: [CustomerInteractionsService],
  exports: [CustomerInteractionsService, TypeOrmModule],
})
export class CustomerInteractionsModule {}
