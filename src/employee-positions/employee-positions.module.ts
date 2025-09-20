import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeePositionsService } from './employee-positions.service';
import { EmployeePositionsController } from './employee-positions.controller';
import { EmployeePosition } from './entities/employee-position.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeePosition])],
  controllers: [EmployeePositionsController],
  providers: [EmployeePositionsService],
  exports: [EmployeePositionsService, TypeOrmModule],
})
export class EmployeePositionsModule {}
