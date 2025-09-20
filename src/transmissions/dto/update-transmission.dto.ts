import { PartialType } from '@nestjs/mapped-types';
import { CreateTransmissionDto } from './create-transmission.dto';

export class UpdateTransmissionDto extends PartialType(CreateTransmissionDto) {}
