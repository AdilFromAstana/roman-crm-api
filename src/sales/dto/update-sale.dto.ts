import { CreateSaleDto } from './create-sale.dto';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateSaleDto extends PartialType(CreateSaleDto) {
  @ApiPropertyOptional({
    example: 'SOLD',
    description: 'Код статуса продажи',
    required: false,
  })
  @IsString()
  @IsOptional()
  salesStatusCode?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Выплачены ли бонусы',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isCommissionPaid?: boolean;
}
