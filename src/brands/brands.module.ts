import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { Brand } from './entities/brand.entity';

// brands/brands.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([Brand]),
    // Убираем ModelsModule из imports если он там был
  ],
  controllers: [BrandsController],
  providers: [BrandsService],
  exports: [BrandsService, TypeOrmModule],
})
export class BrandsModule {}
