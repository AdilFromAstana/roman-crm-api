import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrafficSourcesService } from './traffic-sources.service';
import { TrafficSourcesController } from './traffic-sources.controller';
import { TrafficSource } from './entities/traffic-source.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrafficSource])],
  controllers: [TrafficSourcesController],
  providers: [TrafficSourcesService],
  exports: [TrafficSourcesService, TypeOrmModule],
})
export class TrafficSourcesModule {}
