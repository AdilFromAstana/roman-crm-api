// sales/sales.income-processors.ts
import { EmployeeIncome } from '../employee-incomes/entities/employee-income.entity';
import { Sale } from './entities/sale.entity';

export class SalesIncomeProcessors {
  async createEmployeeIncomeRecordsWithManager(
    manager: any,
    sale: Sale,
  ): Promise<void> {
    try {
      // Бонус продавца
      if (sale.saleEmployeeBonus && sale.saleEmployeeBonus > 0) {
        const income = manager.create(EmployeeIncome, {
          employeeId: sale.saleEmployeeId,
          saleId: sale.id,
          incomeAmount: sale.saleEmployeeBonus,
          incomeType: 'SALE_BONUS',
          description: `Бонус за продажу ${sale.bringCar.brandCode} ${sale.bringCar.modelCode}`,
        });
        await manager.save(income);
      }

      // Бонус загнавшего
      if (sale.bringEmployeeBonus && sale.bringEmployeeBonus > 0) {
        const income = manager.create(EmployeeIncome, {
          employeeId: sale.bringEmployeeId,
          saleId: sale.id,
          incomeAmount: sale.bringEmployeeBonus,
          incomeType: 'SALE_BONUS',
          description: `Бонус за загон ${sale.bringCar.brandCode} ${sale.bringCar.modelCode}`,
        });
        await manager.save(income);
      }

      // Бонус менеджера (если есть)
      if (
        sale.managerEmployeeId &&
        sale.managerEmployeeBonus &&
        sale.managerEmployeeBonus > 0
      ) {
        const income = manager.create(EmployeeIncome, {
          employeeId: sale.managerEmployeeId,
          saleId: sale.id,
          incomeAmount: sale.managerEmployeeBonus,
          incomeType: 'SALE_BONUS',
          description: `Бонус менеджера за продажу ${sale.bringCar.brandCode} ${sale.bringCar.modelCode}`,
        });
        await manager.save(income);
      }
    } catch (error) {
      console.error('Ошибка при создании записей доходов:', error);
      throw error;
    }
  }
}
