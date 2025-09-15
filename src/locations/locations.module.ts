// src/locations/locations.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { City } from './entities/city.entity';
import { District } from './entities/district.entity';

@Module({
  imports: [TypeOrmModule.forFeature([City, District])],
  providers: [LocationsService],
  controllers: [LocationsController],
  exports: [LocationsService],
})
export class LocationsModule {}
