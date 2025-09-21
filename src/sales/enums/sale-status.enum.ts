// sales/enums/sale-status.enum.ts
export enum SaleStatus {
  ON_APPROVAL = 'ON_APPROVAL', // На одобрении
  ON_PROCESSING = 'ON_PROCESSING', // На оформлении
  SOLD = 'SOLD', // Продан
  BONUSES_ISSUED = 'BONUSES_ISSUED', // Бонусы выданы
  COMMISSION_ISSUED = 'COMMISSION_ISSUED', // Комиссия выдана
}

export const SALE_STATUS_LABELS: Record<SaleStatus, string> = {
  [SaleStatus.ON_APPROVAL]: 'На одобрении',
  [SaleStatus.ON_PROCESSING]: 'На оформлении',
  [SaleStatus.SOLD]: 'Продан',
  [SaleStatus.BONUSES_ISSUED]: 'Бонусы выданы',
  [SaleStatus.COMMISSION_ISSUED]: 'Комиссия выдана',
};

export const SALE_STATUS_DESCRIPTIONS: Record<SaleStatus, string> = {
  [SaleStatus.ON_APPROVAL]: 'Начальный статус продажи, ожидание одобрения',
  [SaleStatus.ON_PROCESSING]: 'Оформление документов, подготовка к продаже',
  [SaleStatus.SOLD]: 'Автомобиль продан, ожидание выдачи бонусов',
  [SaleStatus.BONUSES_ISSUED]: 'Бонусы сотрудникам выданы, ожидание комиссии',
  [SaleStatus.COMMISSION_ISSUED]: 'Все выплаты завершены, продажа закрыта',
};
