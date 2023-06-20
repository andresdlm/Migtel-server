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
import { User } from 'src/employees/entities/user.entity';
import { InvoiceServiceRelation } from './invoice-service-relation.entity';
import { ColumnNumericTransformer } from 'src/common/colum-numeric-transformer';

@Entity({ name: 'invoices' })
export class Invoice {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'invoice_number', type: 'int' })
  invoiceNumber: number;

  @Column({ name: 'client_id' })
  clientId: number;

  @Column({ name: 'client_firstname', nullable: true })
  clientFirstname: string;

  @Column({ name: 'client_lastname', nullable: true })
  clientLastname: string;

  @Column({ name: 'client_company_name', nullable: true })
  clientCompanyName: string;

  @Column({ name: 'client_document' })
  clientDocument: string;

  @Column({ name: 'client_address' })
  clientAddress: string;

  @CreateDateColumn({
    name: 'register_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  registerDate: Date;

  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.invoices)
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod: PaymentMethod;

  @Column({ name: 'payment_method_id', type: 'int' })
  paymentMethodId: number;

  @Column({
    type: 'numeric',
    transformer: new ColumnNumericTransformer(),
  })
  subtotal: number;

  @Column({ type: 'numeric', transformer: new ColumnNumericTransformer() })
  iva: number;

  @Column({ type: 'numeric', transformer: new ColumnNumericTransformer() })
  iva_r: number;

  @Column({ type: 'numeric', transformer: new ColumnNumericTransformer() })
  iva_p: number;

  @Column({ type: 'numeric', transformer: new ColumnNumericTransformer() })
  islr: number;

  @Column({ type: 'numeric', transformer: new ColumnNumericTransformer() })
  igtf: number;

  @Column({
    name: 'total_amount',
    type: 'numeric',
    transformer: new ColumnNumericTransformer(),
  })
  totalAmount: number;

  @Column({
    name: 'exhange_rate',
    type: 'numeric',
    transformer: new ColumnNumericTransformer(),
  })
  exhangeRate: number;

  @Column({ type: 'varchar', length: 500 })
  comment: string;

  @Column({ type: 'varchar', length: 500 })
  period: string;

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

  @Column({ type: 'int', default: 0 })
  organizationId: number;

  @Column({ name: 'bank_reference', type: 'varchar', default: '' })
  bankReference: string;

  @OneToMany(() => InvoiceProductRelation, (products) => products.invoice)
  products: InvoiceProductRelation[];

  @OneToMany(() => InvoiceServiceRelation, (services) => services.invoice)
  services: InvoiceServiceRelation[];

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
