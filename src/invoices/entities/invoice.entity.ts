import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { ClientService } from 'src/clients/entities/client-service.entity';
import { Client } from 'src/clients/entities/client.entity';
import { PaymentMethod } from 'src/payment-methods/entities/payment-method.entity';
import { InvoiceConcept } from './invoice-concept.entity';

@Entity({ name: 'invoices' })
export class Invoice {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'invoice_number', type: 'int' })
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
    name: 'invoice_services',
    joinColumn: {
      name: 'invoice_number',
    },
    inverseJoinColumn: {
      name: 'client_service_id',
    },
  })
  clientsServices: ClientService[];

  @ManyToMany(
    () => InvoiceConcept,
    (invoiceConcepts) => invoiceConcepts.invoices,
  )
  @JoinTable({
    name: 'invoice_concept_relation',
    joinColumn: {
      name: 'invoice_number',
    },
    inverseJoinColumn: {
      name: 'invoice_concept_id',
    },
  })
  invoiceConcepts: InvoiceConcept[];

  @UpdateDateColumn({
    name: 'update_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;
}
