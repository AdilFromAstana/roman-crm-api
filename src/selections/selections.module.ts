// src/selections/selections.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SelectionsService } from './selections.service';
import { SelectionsController } from './selections.controller';
import { Selection } from './entities/selection.entity';
import { PropertiesModule } from '../properties/properties.module';

@Module({
  imports: [TypeOrmModule.forFeature([Selection]), PropertiesModule],
  providers: [SelectionsService],
  controllers: [SelectionsController],
  exports: [SelectionsService],
})
export class SelectionsModule {}
