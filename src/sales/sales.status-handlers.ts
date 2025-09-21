// sales/sales.status-handlers.ts
import { BadRequestException } from '@nestjs/common';
import { Sale } from './entities/sale.entity';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Repository } from 'typeorm';
import { SaleStatus } from './enums/sale-status.enum';

export class SalesStatusHandlers {
  constructor(private readonly salesRepository: Repository<Sale>) {}

  async validateStatusRequirements(
    existingSale: Sale,
    updateDto: UpdateSaleDto,
  ): Promise<void> {
    const newStatus = updateDto.salesStatusCode;
    const oldStatus = existingSale.salesStatusCode;
    const errors: string[] = [];

    if (!newStatus || newStatus === oldStatus) return;

    // Проверяем возможность перехода между статусами
    await this.validateStatusTransition(
      oldStatus,
      newStatus,
      existingSale,
      updateDto,
    );

    console.log('newStatus: ', newStatus);

    switch (newStatus) {
      case SaleStatus.ON_APPROVAL:
        break;

      case SaleStatus.ON_PROCESSING:
        if (updateDto.saleDate === undefined && !existingSale.saleDate) {
          errors.push(
            'Для статуса "На оформлении" требуется указать дату продажи',
          );
        }
        if (updateDto.salePrice === undefined && !existingSale.salePrice) {
          errors.push(
            'Для статуса "На оформлении" требуется указать цену продажи',
          );
        }
        break;

      case SaleStatus.SOLD:
        const saleDate =
          updateDto.saleDate !== undefined
            ? updateDto.saleDate
            : existingSale.saleDate;
        const salePrice =
          updateDto.salePrice !== undefined
            ? updateDto.salePrice
            : existingSale.salePrice;

        if (!saleDate) {
          errors.push('Для статуса "Продан" требуется указать дату продажи');
        }
        if (!salePrice || salePrice <= 0) {
          errors.push(
            'Для статуса "Продан" требуется указать корректную цену продажи',
          );
        }
        break;

      case SaleStatus.BONUSES_ISSUED:
        // Проверяем обязательные поля для BONUSES_ISSUED
        const requiredFields = [
          'saleEmployeeBonus',
          'bringEmployeeBonus',
          'totalBonuses',
        ];

        requiredFields.forEach((field) => {
          if (updateDto[field] === undefined) {
            errors.push(
              `Для статуса "Бонусы выданы" требуется указать ${this.getFieldName(field)}`,
            );
          }
        });

        // Проверяем чистую прибыль
        const currentSalePrice =
          updateDto.salePrice !== undefined
            ? updateDto.salePrice
            : existingSale.salePrice;
        const currentPurchasePrice =
          updateDto.purchasePrice !== undefined
            ? updateDto.purchasePrice
            : existingSale.purchasePrice;
        const calculatedNetProfit = currentSalePrice - currentPurchasePrice;

        if (calculatedNetProfit <= 0) {
          errors.push(
            'Для статуса "Бонусы выданы" чистая прибыль должна быть положительной',
          );
        }

        // Если все бонусы переданы, проверяем их сумму
        if (
          updateDto.saleEmployeeBonus !== undefined &&
          updateDto.bringEmployeeBonus !== undefined &&
          updateDto.totalBonuses !== undefined
        ) {
          const calculatedTotal =
            (updateDto.saleEmployeeBonus || 0) +
            (updateDto.bringEmployeeBonus || 0) +
            (updateDto.managerEmployeeBonus || 0);

          if (calculatedTotal !== updateDto.totalBonuses) {
            errors.push(
              'Общая сумма бонусов не соответствует сумме отдельных бонусов',
            );
          }

          if (calculatedTotal > calculatedNetProfit) {
            errors.push(
              `Сумма бонусов (${calculatedTotal}) не может превышать чистую прибыль (${calculatedNetProfit})`,
            );
          }
        }
        break;

      case SaleStatus.COMMISSION_ISSUED:
        if (existingSale.salesStatusCode !== SaleStatus.BONUSES_ISSUED) {
          errors.push(
            'Нельзя перейти в статус "Комиссия выдана" без предварительного выдачи бонусов',
          );
        }
        break;

      default:
        errors.push(`Неизвестный статус продажи: ${newStatus}`);
    }

    console.log('Errors: ', errors);

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Ошибки валидации статуса продажи',
        errors: errors,
      });
    }
  }

  // Вспомогательный метод для красивых названий полей
  private getFieldName(field: string): string {
    const fieldNames: Record<string, string> = {
      saleEmployeeBonus: 'бонус продавца',
      bringEmployeeBonus: 'бонус загнавшего',
      managerEmployeeBonus: 'бонус менеджера',
      totalBonuses: 'общая сумма бонусов',
    };

    return fieldNames[field] || field;
  }

  // Проверка возможности перехода между статусами
  private async validateStatusTransition(
    oldStatus: string,
    newStatus: string,
    existingSale: Sale,
    updateDto: UpdateSaleDto,
  ): Promise<void> {
    const errors: string[] = [];

    // Определяем допустимые переходы
    const allowedTransitions: Record<string, string[]> = {
      [SaleStatus.ON_APPROVAL]: [SaleStatus.ON_PROCESSING, SaleStatus.SOLD],
      [SaleStatus.ON_PROCESSING]: [
        SaleStatus.SOLD,
        SaleStatus.ON_APPROVAL,
        SaleStatus.BONUSES_ISSUED,
      ],
      [SaleStatus.SOLD]: [SaleStatus.BONUSES_ISSUED, SaleStatus.ON_PROCESSING],
      [SaleStatus.BONUSES_ISSUED]: [
        SaleStatus.COMMISSION_ISSUED,
        SaleStatus.SOLD,
      ],
      [SaleStatus.COMMISSION_ISSUED]: [], // Финальный статус
    };

    const allowedNextStatuses = allowedTransitions[oldStatus] || [];

    // Проверяем, разрешен ли переход
    // Разрешаем переход если:
    // 1. Это финальный статус (COMMISSION_ISSUED) - нельзя менять
    // 2. Или переход входит в список разрешенных
    // 3. Или список разрешенных пуст (все разрешены)
    const isTransitionAllowed =
      oldStatus === SaleStatus.COMMISSION_ISSUED || // Финальный статус
      allowedNextStatuses.includes(newStatus) || // Переход разрешен
      allowedNextStatuses.length === 0; // Все переходы разрешены

    console.log('Проверка перехода:', {
      from: oldStatus,
      to: newStatus,
      allowed: allowedNextStatuses,
      isAllowed: isTransitionAllowed,
    });

    // Если это не финальный статус и переход не разрешен
    if (
      oldStatus !== SaleStatus.COMMISSION_ISSUED &&
      allowedNextStatuses.length > 0 &&
      !allowedNextStatuses.includes(newStatus)
    ) {
      errors.push(
        `Недопустимый переход статуса: из "${oldStatus}" в "${newStatus}". Разрешенные переходы: ${allowedNextStatuses.join(', ')}`,
      );
    }

    // Особый случай: нельзя изменять финальный статус
    if (oldStatus === SaleStatus.COMMISSION_ISSUED) {
      errors.push(
        `Нельзя изменить финальный статус "${SaleStatus.COMMISSION_ISSUED}"`,
      );
    }

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Ошибки перехода статусов',
        errors: errors,
      });
    }
  }
}
