export interface Dashboard {
  dailyIncome: number;
  monthIncome: number;
  taxesGeneratedByMonth: number;
  newClientsInMonth: number;
  yearIncome: number[];
  cities: CityDashboard[];
  plans: PlansDashboard[];
  accountsBalance: PaymentMethodDashboard[];
}

export interface CityDashboard {
  city: string;
  clients: number;
  raised: number;
}

export interface PlansDashboard {
  name: string;
  count: number;
  raised: number;
}

export interface PaymentMethodDashboard {
  id: number;
  name: string;
  count: number;
  balance: number;
}
