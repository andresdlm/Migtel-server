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

import { Client } from 'src/clients/entities/client.entity';
import { PaymentMethod } from 'src/payment-methods/entities/payment-method.entity';
import { InvoiceConceptRelation } from './invoice-concept-relation.entity';
import { InvoiceConcept } from './invoice-concept.entity';
import { InvoiceServices } from './invoice-service-relation.entity';
import { ClientService } from 'src/clients/entities/client-service.entity';

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

  @OneToMany(
    () => InvoiceServices,
    (invoiceServices) => invoiceServices.invoice,
  )
  invoiceServices: InvoiceServices[];

  @OneToMany(
    () => InvoiceConceptRelation,
    (invoiceConceptRelation) => invoiceConceptRelation.invoice,
  )
  invoiceConceptRelation: InvoiceConceptRelation[];

  @UpdateDateColumn({
    name: 'update_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;

  invoiceConcepts?: InvoiceConcept[];
  invoiceConceptCount?: number[];
  clientServices?: ClientService[];
  clientServicesCount?: number[];
}
