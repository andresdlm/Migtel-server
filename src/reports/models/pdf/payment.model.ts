import { User } from "src/employees/entities/user.entity";
import { PaymentMethod } from "./reports.model";

export interface Payment {
  id: number;
  clientId: number;
  clientFirstname: string;
  clientLastname: string;
  clientCompanyName: string;
  clientDocument: string;
  clientAddress: string;
  registerDate: Date;
  paymentMethod: PaymentMethod;
  paymentMethodId: number;
  amount: number;
  exhangeRate: number;
  comment: string;
  period: string;
  clientType: number;
  organizationId: number;
  bankReference: string;
  currencyCode: string;
  user: User;
  userId: number;
}
