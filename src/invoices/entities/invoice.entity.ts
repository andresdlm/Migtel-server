import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { PaymentMethod } from 'src/payment-methods/entities/payment-method.entity';
import { InvoiceProductRelation } from './invoice-product-relation.entity';
import { User } from 'src/users/entities/user.entity';
import { InvoiceServiceRelation } from './invoice-service-relation.entity';

@Entity({ name: 'invoices' })
export class Invoice {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'invoice_number', type: 'int' })
  invoiceNumber: number;

  @Column({ name: 'client_id' })
  clientId: number;

  @Column({ name: 'client_firstname' })
  clientFirstname: string;

  @Column({ name: 'client_lastname' })
  clientLastname: string;

  @Column({ name: 'client_company_name' })
  clientCompanyName: string;

  @Column({ name: 'client_document' })
  clientDocument: string;

  @Column({ name: 'client_address' })
  clientAddress: string;

  @CreateDateColumn({
    name: 'register_date',
    type: 'date',
    default: () => 'CURRENT_DATE',
  })
  registerDate: Date;

  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.invoices)
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod: PaymentMethod;

  @Column({ name: 'payment_method_id', type: 'int' })
  paymentMethodId: number;

  @Column({ type: 'real' })
  subtotal: number;

  @Column({ type: 'real' })
  iva: number;

  @Column({ type: 'real' })
  iva_r: number;

  @Column({ type: 'real' })
  iva_p: number;

  @Column({ type: 'real' })
  islr: number;

  @Column({ type: 'real' })
  igtf: number;

  @Column({ name: 'total_amount', type: 'real' })
  totalAmount: number;

  @Column({ name: 'exhange_rate', type: 'real' })
  exhangeRate: number;

  @Column({ name: 'bonus_amount', type: 'real' })
  bonusAmount: number;

  @Column({ name: 'credit_amount', type: 'real' })
  creditAmount: number;

  @Column({ type: 'varchar', length: 500 })
  comment: string;

  @Column({ name: 'currency_code', type: 'varchar' })
  currencyCode: string;

  @Column({ type: 'boolean', default: false })
  canceled: boolean;

  @Column({ type: 'boolean', default: false })
  printed: boolean;

  @Column({ type: 'varchar', length: 20, default: 'FACT' })
  type: string;

  @Column({ type: 'boolean', default: true })
  paid: boolean;

  @OneToMany(
    () => InvoiceProductRelation,
    (invoiceProductRelation) => invoiceProductRelation.invoice,
  )
  invoiceProductRelation: InvoiceProductRelation[];

  @OneToMany(
    () => InvoiceServiceRelation,
    (invoiceServiceRelation) => invoiceServiceRelation.invoice,
  )
  invoiceServiceRelation: InvoiceServiceRelation[];

  @ManyToOne(() => User, (user) => user.invoices)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @UpdateDateColumn({
    name: 'update_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;
}
