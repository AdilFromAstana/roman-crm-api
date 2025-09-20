// bring-cars/bring-cars.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BringCarsService } from './bring-cars.service';
import { BringCarsController } from './bring-cars.controller';
import { BringCar } from './entities/bring-car.entity';
import { BrandsModule } from '../brands/brands.module';
import { ModelsModule } from '../models/models.module';
import { ColorsModule } from '../colors/colors.module';
import { FuelTypesModule } from '../fuel-types/fuel-types.module';
import { TransmissionsModule } from '../transmissions/transmissions.module';
import { EmployeesModule } from '../employees/employees.module';
import { FeaturesModule } from '../features/features.module';
import { BringCarImagesModule } from '../bring-car-images/bring-car-images.module';
import { SalesStatusesModule } from '../sales-statuses/sales-statuses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BringCar]),
    BrandsModule,
    ModelsModule,
    ColorsModule,
    FuelTypesModule,
    TransmissionsModule,
    EmployeesModule,
    FeaturesModule,
    forwardRef(() => BringCarImagesModule),
    forwardRef(() => SalesStatusesModule),
  ],
  controllers: [BringCarsController],
  providers: [BringCarsService],
  exports: [BringCarsService, TypeOrmModule],
})
export class BringCarsModule {}
