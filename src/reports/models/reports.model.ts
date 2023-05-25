export interface Account {
  id: number;
  name: string;
  payments: number;
  usd_balance: number;
  bs_balance: number;
}

export interface Summary {
  payments: number;
  total_usd_balance: number;
  total_bs_balance: number;
}
