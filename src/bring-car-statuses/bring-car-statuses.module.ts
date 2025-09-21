// bring-car-statuses/bring-car-statuses.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BringCarStatusesService } from './bring-car-statuses.service';
import { BringCarStatusesController } from './bring-car-statuses.controller';
import { BringCarStatus } from './entities/bring-car-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BringCarStatus])],
  controllers: [BringCarStatusesController],
  providers: [BringCarStatusesService],
  exports: [BringCarStatusesService, TypeOrmModule],
})
export class BringCarStatusesModule {}
