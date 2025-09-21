// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandsModule } from './brands/brands.module';
import { Brand } from './brands/entities/brand.entity';
import { ModelsModule } from './models/models.module';
import { Model } from './models/entities/model.entity';
import { ColorsModule } from './colors/colors.module';
import { Color } from './colors/entities/color.entity';
import { FuelTypesModule } from './fuel-types/fuel-types.module';
import { FuelType } from './fuel-types/entities/fuel-type.entity';
import { TransmissionsModule } from './transmissions/transmissions.module';
import { Transmission } from './transmissions/entities/transmission.entity';
import { FeaturesModule } from './features/features.module';
import { Feature } from './features/entities/feature.entity';
import { EmployeePositionsModule } from './employee-positions/employee-positions.module';
import { Employee } from './employees/entities/employee.entity';
import { EmployeesModule } from './employees/employees.module';
import { EmployeePosition } from './employee-positions/entities/employee-position.entity';
import { BringCarImagesModule } from './bring-car-images/bring-car-images.module';
import { BringCarImage } from './bring-car-images/entities/bring-car-image.entity';
import { BringCarsModule } from './bring-cars/bring-cars.module';
import { BringCar } from './bring-cars/entities/bring-car.entity';
import { TrafficSourcesModule } from './traffic-sources/traffic-sources.module';
import { TrafficSource } from './traffic-sources/entities/traffic-source.entity';
import { CustomerStatusesModule } from './customer-statuses/customer-statuses.module';
import { CustomerStatus } from './customer-statuses/entities/customer-status.entity';
import { SalesStatusesModule } from './sales-statuses/sales-statuses.module';
import { SalesStatus } from './sales-statuses/entities/sales-status.entity';
import { CustomerInteractionsModule } from './customer-interactions/customer-interactions.module';
import { CustomerInteraction } from './customer-interactions/entities/customer-interaction.entity';
import { Customer } from './customers/entities/customer.entity';
import { CustomersModule } from './customers/customers.module';
import { SalesModule } from './sales/sales.module';
import { Sale } from './sales/entities/sale.entity';
import { EmployeeIncome } from './employee-incomes/entities/employee-income.entity';
import { EmployeeIncomesModule } from './employee-incomes/employee-incomes.module';
import { BringCarStatusesModule } from './bring-car-statuses/bring-car-statuses.module';
import { BringCarStatus } from './bring-car-statuses/entities/bring-car-status.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'avto-crm',
      entities: [
        BringCarStatus,
        Sale,
        Brand,
        Model,
        Color,
        FuelType,
        Transmission,
        Feature,
        Employee,
        EmployeePosition,
        EmployeeIncome,
        BringCarImage,
        BringCar,
        TrafficSource,
        SalesStatus,
        Customer,
        CustomerStatus,
        CustomerInteraction,
      ],
      synchronize: true,
    }),
    BringCarStatusesModule,
    SalesModule,
    BrandsModule,
    ModelsModule,
    ColorsModule,
    FuelTypesModule,
    TransmissionsModule,
    FeaturesModule,
    EmployeesModule,
    EmployeePositionsModule,
    EmployeeIncomesModule,
    BringCarImagesModule,
    BringCarsModule,
    TrafficSourcesModule,
    SalesStatusesModule,
    CustomersModule,
    CustomerStatusesModule,
    CustomerInteractionsModule,
  ],
})
export class AppModule {}
