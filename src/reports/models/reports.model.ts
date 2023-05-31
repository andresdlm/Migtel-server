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

export interface SummarySalesBook {
  total_subtotal: number;
  total_iva: number;
  total_iva_r: number;
  total_iva_p: number;
  total_igtf: number;
  total_islr: number;
  total_amount: number;
  total_invoices: number;
  total_invoices_canceled: number;
}