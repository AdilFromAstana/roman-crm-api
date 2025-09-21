// sales/sales.validators.ts
import { BadRequestException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { BringCarsService } from '../bring-cars/bring-cars.service';
import { CustomersService } from '../customers/customers.service';
import { EmployeesService } from '../employees/employees.service';
import { SalesStatusesService } from '../sales-statuses/sales-statuses.service';

export class SalesValidators {
  constructor(
    private readonly bringCarsService: BringCarsService,
    private readonly customersService: CustomersService,
    private readonly employeesService: EmployeesService,
    private readonly salesStatusesService: SalesStatusesService,
  ) {}

  async validateRelatedEntities(
    dto: CreateSaleDto | UpdateSaleDto,
  ): Promise<void> {
    const errors: string[] = [];

    try {
      // Проверяем загнанный автомобиль
      if (dto.bringCarId) {
        try {
          await this.bringCarsService.findOne(dto.bringCarId);
        } catch (error) {
          errors.push(
            `Загнанный автомобиль с ID "${dto.bringCarId}" не найден`,
          );
        }
      }

      // Проверяем клиента
      if (dto.customerId) {
        try {
          await this.customersService.findOne(dto.customerId);
        } catch (error) {
          errors.push(`Клиент с ID "${dto.customerId}" не найден`);
        }
      }

      // Проверяем сотрудника-продавца
      if (dto.saleEmployeeId) {
        try {
          await this.employeesService.findOne(dto.saleEmployeeId);
        } catch (error) {
          errors.push(
            `Сотрудник-продавец с ID "${dto.saleEmployeeId}" не найден`,
          );
        }
      }

      // Проверяем сотрудника, загнавшего авто
      if (dto.bringEmployeeId) {
        try {
          await this.employeesService.findOne(dto.bringEmployeeId);
        } catch (error) {
          errors.push(
            `Сотрудник, загнавший авто, с ID "${dto.bringEmployeeId}" не найден`,
          );
        }
      }

      // Проверяем менеджера (если указан)
      if (dto.managerEmployeeId) {
        try {
          await this.employeesService.findOne(dto.managerEmployeeId);
        } catch (error) {
          errors.push(`Менеджер с ID "${dto.managerEmployeeId}" не найден`);
        }
      }

      // Проверяем статус продажи (только для Update)
      const updateDto = dto as UpdateSaleDto;
      if (updateDto.salesStatusCode) {
        try {
          await this.salesStatusesService.findOneByCode(
            updateDto.salesStatusCode,
          );
        } catch (error) {
          errors.push(
            `Статус продажи с кодом "${updateDto.salesStatusCode}" не найден`,
          );
        }
      }

      if (errors.length > 0) {
        throw new BadRequestException({
          message: 'Ошибки валидации связанных сущностей',
          errors: errors,
        });
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Ошибка валидации связанных сущностей');
    }
  }

  validateBonusAmounts(
    saleDto: CreateSaleDto | UpdateSaleDto,
    salePrice: number,
    purchasePrice: number,
  ): void {
    if (!this.areBonusesProvided(saleDto)) {
      return;
    }

    const saleEmployeeBonus = saleDto.saleEmployeeBonus || 0;
    const bringEmployeeBonus = saleDto.bringEmployeeBonus || 0;
    const managerEmployeeBonus = saleDto.managerEmployeeBonus || 0;
    const totalBonuses = saleDto.totalBonuses || 0;

    const calculatedTotal =
      saleEmployeeBonus + bringEmployeeBonus + managerEmployeeBonus;
    const netProfit = salePrice - purchasePrice;

    if (calculatedTotal > netProfit) {
      throw new BadRequestException(
        `Сумма бонусов (${calculatedTotal}) не может превышать чистую прибыль (${netProfit})`,
      );
    }

    if (calculatedTotal !== totalBonuses) {
      throw new BadRequestException(
        `Общая сумма бонусов (${totalBonuses}) не соответствует сумме отдельных бонусов (${calculatedTotal})`,
      );
    }
  }

  areBonusesProvided(dto: CreateSaleDto | UpdateSaleDto): boolean {
    return (
      dto.saleEmployeeBonus !== undefined ||
      dto.bringEmployeeBonus !== undefined ||
      dto.managerEmployeeBonus !== undefined ||
      dto.totalBonuses !== undefined
    );
  }
}
