// sales/sales.helpers.ts
import { Repository } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { ConflictException } from '@nestjs/common';
import { UpdateSaleDto } from './dto/update-sale.dto';

export class SalesHelpers {
  constructor(private readonly salesRepository: Repository<Sale>) {}

  hasRelatedEntityUpdates(dto: UpdateSaleDto): boolean {
    return !!(
      dto.bringCarId ||
      dto.customerId ||
      dto.saleEmployeeId ||
      dto.bringEmployeeId ||
      dto.managerEmployeeId ||
      dto.salesStatusCode
    );
  }

  async checkCarSaleStatus(bringCarId: string): Promise<void> {
    const existingSale = await this.salesRepository.findOne({
      where: { bringCarId },
    });

    if (existingSale) {
      if (existingSale.salesStatusCode === 'COMMISSION_ISSUED') {
        throw new ConflictException(
          `Автомобиль с ID ${bringCarId} уже полностью продан. Невозможно создать повторную продажу.`,
        );
      } else {
        throw new ConflictException(
          `Автомобиль с ID ${bringCarId} уже находится в процессе продажи (статус: ${existingSale.salesStatusCode}).`,
        );
      }
    }
  }
}
