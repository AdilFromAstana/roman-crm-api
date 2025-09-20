import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerStatusesService } from './customer-statuses.service';
import { CustomerStatusesController } from './customer-statuses.controller';
import { CustomerStatus } from './entities/customer-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerStatus])],
  controllers: [CustomerStatusesController],
  providers: [CustomerStatusesService],
  exports: [CustomerStatusesService, TypeOrmModule],
})
export class CustomerStatusesModule {}
