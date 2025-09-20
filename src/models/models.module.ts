import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelsService } from './models.service';
import { ModelsController } from './models.controller';
import { Model } from './entities/model.entity';
import { BrandsModule } from '../brands/brands.module';

@Module({
  imports: [TypeOrmModule.forFeature([Model]), BrandsModule],
  controllers: [ModelsController],
  providers: [ModelsService],
  exports: [ModelsService, TypeOrmModule],
})
export class ModelsModule {}
