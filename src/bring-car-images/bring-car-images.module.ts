import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BringCarImagesService } from './bring-car-images.service';
import { BringCarImagesController } from './bring-car-images.controller';
import { BringCarImage } from './entities/bring-car-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BringCarImage])],
  controllers: [BringCarImagesController],
  providers: [BringCarImagesService],
  exports: [BringCarImagesService, TypeOrmModule],
})
export class BringCarImagesModule {}
