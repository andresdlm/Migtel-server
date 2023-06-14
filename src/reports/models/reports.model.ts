export interface Account {
  id: number;
  name: string;
  payments: number;
  usd_balance: number;
  bs_balance: number;
}

export interface Igtf {
  id: number;
  client_firstname: string;
  client_lastname: string;
  client_companyname: string;
  register_date: Date;
  invoice_number: number;
  igtf: number;
  exhange_rate: number;
  currency_code: string;
  payment_method_name: string;
  imponible: number;
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

export interface SummaryRetentions {
  total_subtotal: number;
  total_iva: number;
  total_iva_r: number;
  total_iva_p: number;
  total_igtf: number;
  total_islr: number;
  total_amount: number;
  total_neto: number;
  total_invoices: number;
  total_invoices_canceled: number;
}

export interface SummaryReference {
  total_amount_usd: number;
  total_amount_bs: number;
  total_references: number;
}

export interface SummaryIgtfBook {
  total_igtf: number;
  total_invoices: number;
  total_imponible: number;
}