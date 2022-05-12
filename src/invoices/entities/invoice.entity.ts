import { ClientService } from 'src/clients/entities/client-service.entity';
import { Client } from 'src/clients/entities/client.entity';
import { PaymentMethod } from 'src/payment-methods/entities/payment-method.entity';
import {
  PrimaryColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity({ name: 'invoices' })
export class Invoice {
  @PrimaryColumn({ name: 'invoice_number' })
  invoiceNumber: number;

  @ManyToOne(() => Client, (client) => client.invoices)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({ name: 'client_id' })
  clientId: number;

  @CreateDateColumn({
    name: 'register_date',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  registerDate: Date;

  @Column({ type: 'int' })
  group: number;

  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.invoices)
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod: PaymentMethod;

  @Column({ name: 'payment_method_id', type: 'varchar' })
  paymentMethodId: string;

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

  @Column({ type: 'varchar', length: 500 })
  comment: string;

  @Column({ name: 'usd_invoice', type: 'boolean', default: false })
  usdInvoice: boolean;

  @Column({ type: 'boolean', default: false })
  canceled: boolean;

  @ManyToMany(
    () => ClientService,
    (clientsServices) => clientsServices.invoices,
  )
  @JoinTable({
    name: 'invoice_concepts',
    joinColumn: {
      name: 'invoice_number',
    },
    inverseJoinColumn: {
      name: 'client_service_id',
    },
  })
  clientsServices: ClientService[];

  @UpdateDateColumn({
    name: 'update_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;
}
