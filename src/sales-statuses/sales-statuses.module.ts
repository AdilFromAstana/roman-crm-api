import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesStatusesService } from './sales-statuses.service';
import { SalesStatusesController } from './sales-statuses.controller';
import { SalesStatus } from './entities/sales-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SalesStatus])],
  controllers: [SalesStatusesController],
  providers: [SalesStatusesService],
  exports: [SalesStatusesService, TypeOrmModule],
})
export class SalesStatusesModule {}
