/* eslint-disable prettier/prettier */
import { Clients } from 'src/clients/entities/client.entity';
import {
  PrimaryColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { ConceptsInvoice } from './concepts-invoice.entity';

@Entity()
export class Invoices {
  @PrimaryColumn()
  invoice_number: number;

  @ManyToOne(() => Clients, (client) => client.invoices)
  client: Clients;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  register_date: Date;

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

  @Column({ type: 'real' })
  total_amount: number;

  @Column({ type: 'real' })
  exhange_rate: number;

  @Column({ type: 'varchar', length: 500 })
  comment: string;

  @Column({ type: 'boolean', default: false })
  canceled: boolean;

  @OneToMany(() => ConceptsInvoice, (conceptsInvoice) => conceptsInvoice.invoice)
  concepts: ConceptsInvoice[];

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  update_at: Date;
}
