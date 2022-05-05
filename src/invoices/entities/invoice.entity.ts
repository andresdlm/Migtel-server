/* eslint-disable prettier/prettier */
import { Client } from 'src/clients/entities/client.entity';
import {
  PrimaryColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm';
import { InvoiceConcept } from './invoice-concept.entity';

@Entity({ name: 'invoices' })
export class Invoice {
  @PrimaryColumn({ name: 'invoice_number' })
  invoiceNumber: number;

  @ManyToOne(() => Client, (client) => client.invoices)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({ name: 'client_id' })
  clientId: number;

  @CreateDateColumn({ name: 'register_date',type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  registerDate: Date;

  @Column({ type: 'int' })
  group: number;

  @Column({ type: 'int' })
  coc: number;

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

  @Column({ type: 'boolean', default: false })
  canceled: boolean;

  @OneToMany(() => InvoiceConcept, (invoiceConcept) => invoiceConcept.invoice)
  concepts: InvoiceConcept[];

  @UpdateDateColumn({ name: 'update_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updateAt: Date;
}
