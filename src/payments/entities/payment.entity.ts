import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { PaymentMethod } from 'src/payment-methods/entities/payment-method.entity';
import { User } from 'src/employees/entities/user.entity';
import { ColumnNumericTransformer } from 'src/common/colum-numeric-transformer';

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

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

  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.payments)
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod: PaymentMethod;

  @Column({ name: 'payment_method_id', type: 'int' })
  paymentMethodId: number;

  @Column({
    name: 'amount',
    type: 'numeric',
    transformer: new ColumnNumericTransformer(),
  })
  amount: number;

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

  @ManyToOne(() => User, (user) => user.invoices)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;
}
