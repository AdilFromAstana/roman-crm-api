// bring-cars/dto/bring-car-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class BrandResponseDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;
}

export class ModelResponseDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;
}

export class ColorResponseDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;
}

export class FuelTypeResponseDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;
}

export class TransmissionResponseDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;
}

export class EmployeeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  positionCodes: string[];
}

export class BringCarImageResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  order: number;
}

export class BringCarStatusCodeDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  isActive?: boolean;

  @ApiProperty()
  sortOrder?: number;
}

export class BringCarResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  brandCode: string;

  @ApiProperty({ type: BrandResponseDto })
  brand: BrandResponseDto;

  @ApiProperty()
  modelCode: string;

  @ApiProperty({ type: ModelResponseDto })
  model: ModelResponseDto;

  @ApiProperty()
  year: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  salePrice: number;

  @ApiProperty()
  mileage: number;

  @ApiProperty()
  colorCode: string;

  @ApiProperty({ type: ColorResponseDto })
  color: ColorResponseDto;

  @ApiProperty()
  fuelTypeCode: string;

  @ApiProperty({ type: FuelTypeResponseDto })
  fuelType: FuelTypeResponseDto;

  @ApiProperty()
  transmissionCode: string;

  @ApiProperty({ type: TransmissionResponseDto })
  transmission: TransmissionResponseDto;

  @ApiProperty()
  featureCodes: string[];

  @ApiProperty()
  description: string;

  @ApiProperty()
  bringCarStatusCode: string;

  @ApiProperty({ type: BringCarStatusCodeDto })
  bringCarStatus: BringCarStatusCodeDto;

  @ApiProperty()
  bringEmployeeId: string;

  @ApiProperty({ type: EmployeeResponseDto })
  bringEmployee: EmployeeResponseDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ type: [BringCarImageResponseDto] })
  images: BringCarImageResponseDto[];
}
