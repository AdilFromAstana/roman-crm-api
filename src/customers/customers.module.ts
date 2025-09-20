// customers/customers.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { Customer } from './entities/customer.entity';
import { TrafficSourcesModule } from '../traffic-sources/traffic-sources.module';
import { CustomerStatusesModule } from '../customer-statuses/customer-statuses.module';
import { BringCarsModule } from '../bring-cars/bring-cars.module';
import { CustomerInteractionsModule } from 'src/customer-interactions/customer-interactions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    forwardRef(() => TrafficSourcesModule),
    forwardRef(() => CustomerStatusesModule),
    forwardRef(() => CustomerInteractionsModule),
    forwardRef(() => BringCarsModule),
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService, TypeOrmModule],
})
export class CustomersModule {}
