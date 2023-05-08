export interface Dashboard {
  dailyIncome: number;
  monthIncome: number;
  taxesGeneratedByMonth: number;
  yearIncome: number[];
  accountsBalance: PaymentMethodDashboard[];
}

export interface PaymentMethodDashboard {
  id: number;
  name: string;
  count: number;
  balance: number;
}
