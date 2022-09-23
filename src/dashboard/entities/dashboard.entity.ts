export interface Dashboard {
  dailyIncome: number;
  monthIncome: number;
  taxesGeneratedByMonth: number;
  newClientsInMonth: number;
  yearIncome: number[];
  cities: CityDashboard[];
  plans: PlansDashboard[];
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
