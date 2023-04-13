export interface Dashboard {
  dailyIncome: number;
  monthIncome: number;
  taxesGeneratedByMonth: number;
  yearIncome: number[];
  accountsBalance: PaymentMethodDashboard[];
}

export interface CityDashboard {
  city: string;
  clients: number;
  raised: number;
}

export interface PaymentMethodDashboard {
  id: number;
  name: string;
  count: number;
  balance: number;
}
