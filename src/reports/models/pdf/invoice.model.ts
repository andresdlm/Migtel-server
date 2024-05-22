import { User } from "src/employees/entities/user.entity";
import { PaymentMethod } from "src/payment-methods/entities/payment-method.entity";
import { Product } from "./product.model";

export interface Invoice {
  id: number;
  invoice_number: number;
  clientId: number;
  clientFirstname: string;
  clientLastname: string;
  clientCompanyName: string;
  client_document: string;
  clientAddress: string;
  register_date: Date;
  paymentDate: Date;
  paymentMethod: PaymentMethod;
  paymentMethodId: number;
  subtotal: number;
  iva: number;
  iva_r: number;
  iva_p: number;
  islr: number;
  igtf: number;
  total_amount: number;
  exhangeRate: number;
  comment: string;
  period: string;
  currencyCode: string;
  canceled: boolean;
  printed: boolean;
  clientType: number;
  organizationId: number;
  bankReference: string;
  type: string;
  paid: boolean;
  products: InvoiceProductRelation[];
  services: InvoiceServiceRelation[];
  user: User;
  userId: number;
  updateAt: Date;
  neto:number;
}

export interface InvoiceLikeEntity {
  id: number;
  invoiceNumber: number;
  clientId: number;
  clientFirstname: string;
  clientLastname: string;
  clientCompanyName: string;
  clientDocument: string;
  clientAddress: string;
  registerDate: Date;
  paymentDate: Date;
  paymentMethod: PaymentMethod;
  paymentMethodId: number;
  subtotal: number;
  iva: number;
  iva_r: number;
  iva_p: number;
  islr: number;
  igtf: number;
  totalAmount: number;
  exhangeRate: number;
  comment: string;
  period: string;
  currencyCode: string;
  canceled: boolean;
  printed: boolean;
  type: string;
  paid: boolean;
  clientType: number;
  organizationId: number;
  bankReference: string;
  products: InvoiceProductRelation[];
  services: InvoiceServiceRelation[];
  user: User;
  userId: number;
  updateAt: Date;
  neto: number
}

export interface InvoiceProductRelation {
  invoice: Invoice;
  invoiceId: number;
  product: Product;
  productId: number;
  productName: string;
  count: number;
  price: number;
}

export interface InvoiceServiceRelation {
  invoice: Invoice;
  invoiceId: number;
  serviceId: number;
  servicePlanId: number;
  servicePlanName: string;
  count: number;
  price: number;
}

export interface SalesBookInvoice {
  register_date: Date,
  type: string,
  invoice_number: number,
  client_id: number,
  comment: string,
  client_firstname: string,
  client_lastname: string,
  client_company_name: string,
  client_document: string,
  subtotal: number,
  iva: number,
  iva_r: number,
  iva_p: number,
  igtf: number,
  islr: number,
  total_amount: number,
  neto: number,
}