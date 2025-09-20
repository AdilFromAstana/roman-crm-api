import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransmissionsService } from './transmissions.service';
import { TransmissionsController } from './transmissions.controller';
import { Transmission } from './entities/transmission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transmission])],
  controllers: [TransmissionsController],
  providers: [TransmissionsService],
  exports: [TransmissionsService, TypeOrmModule],
})
export class TransmissionsModule {}
