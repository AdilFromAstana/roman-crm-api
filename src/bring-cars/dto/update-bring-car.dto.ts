// bring-cars/dto/update-bring-car.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateBringCarDto } from './create-bring-car.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateBringCarDto extends PartialType(CreateBringCarDto) {}
