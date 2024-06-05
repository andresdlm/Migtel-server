import { Account, Igtf, SummarySalesBook } from 'src/reports/models/reports.model';
// import { Invoice } from './invoice.model';
import { Payment } from './payment.model';
import { Invoice } from 'src/invoices/entities/invoice.entity';
// import { Payment } from './payment.model';

// export interface PaymentReportDto {
//   organizationId: number;
//   clientType: number;
//   paymentMethod: number;
//   currencyCode: 'BS' | 'USD' | 'ALL';
//   since: Date;
//   until: Date;
// }

// export interface SalesBooksReportDto {
//   organizationId: number;
//   clientType: number;
//   paymentMethod: number;
//   since: Date;
//   until: Date;
//   currencyReport: string;
// }

// export interface ReportDto {
//   since: Date;
//   until: Date;
// }

// export interface ReferenceDto {
//   paymentMethod: number;
//   since: Date;
//   until: Date;
// }

// export interface Account {
//   id: number;
//   name: string;
//   payments: number;
//   usd_balance: number;
//   bs_balance: number;
// }

// export interface Igtf {
//   id: number;
//   client_firstname: string;
//   client_lastname: string;
//   client_company_name: string;
//   register_date: Date;
//   invoice_number: number;
//   igtf: number;
//   exhange_rate: number;
//   currency_code: string;
//   payment_method_name: string;
//   imponible: number;
// }

interface Summary {
  payments: number;
  total_usd_balance: number;
  total_bs_balance: number;
}

// export interface SummarySalesBook {
//   total_subtotal: number;
//   total_iva: number;
//   total_iva_r: number;
//   total_iva_p: number;
//   total_igtf: number;
//   total_islr: number;
//   total_neto: number;
//   total_amount: number;
//   total_invoices: number;
//   total_invoices_canceled: number;
// }

export interface SummaryIgtfBook {
  total_igtf: number;
  total_invoices: number;
  total_imponible: number;
}

export interface AccountReport {
  report: Account[];
  summary: Summary;
}

export interface SalesBookReport {
  report: Invoice[];
  summary: SummarySalesBook;
}

export interface RetentionsReport {
  report: Invoice[];
  summary: SummaryRetentionsReport;
}

export interface PaymentReport {
  report: Payment[];
  summary: any;
}

export interface SummaryRetentionsReport {
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

export interface ReferenceInvoice {
  report: Invoice[];
  summary: SummaryReference;
}

export interface ReferencePayment {
  report: Payment[];
  summary: SummaryReference;
}

export interface SummaryReference {
  total_amount_usd: number;
  total_amount_bs: number;
  total_references: number;
}

export interface IgtfBook {
  report: Igtf[];
  summary: SummaryIgtfBook;
}

export interface SummaryPaid {
  total_invoices: number;
  total_usd: number;
  total_bs: number;
}

export interface PaidInvoice {
  report: Invoice[];
  summary: SummaryPaid;
}

export interface PortalPaymentReportDto {
  since: Date;
  until: Date;
  paymentMethod: number;
}

export interface PortalPayment {
  id: number;
  clientId: number;
  registerDate: Date;
  paymentReference: string;
  clientName: string;
  companyName: string;
  subtotal: number;
  totalAmount: number;
  igtf: number;
  paymentMethodId: string;
  number: string;
  cellphone: string;
  updatedCrm: boolean;
  updatedFact: boolean;
  last4: string;
  paid: boolean;
  reference: string;
  currency: string;
  exchangeRate: number;
  email: string;
  invoiceNumber: number;
  paymentMethod: PaymentMethod;
  neto: number;
  amountFromBank: number;
}

export interface PortalPaymentReport {
  report: PortalPayment[];
  summary: SummaryPortalPayment;
}

export interface SummaryPortalPayment {
  // total_subtotal: number;
  // total_igtf: number;
  total_amount: number;
  total_payments: number;
}

export interface PaymentMethod {
  id: number;
  name: string;
  coc: number;
  crmId: string;
  hasIgtf: boolean;
  archived: boolean;
  createAt: Date;
  updateAt: Date;
}