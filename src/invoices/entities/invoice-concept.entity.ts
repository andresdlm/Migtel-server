import { PrimaryGeneratedColumn, Column, Entity, ManyToMany } from 'typeorm';
import { Invoice } from './invoice.entity';

@Entity({ name: 'invoice_concepts' })
export class InvoiceConcept {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'invoice_description', type: 'varchar', length: 500 })
  invoiceDescription: string;

  @Column({ name: 'price', type: 'real' })
  price: number;

  @ManyToMany(() => Invoice, (invoices) => invoices.invoiceConcepts)
  invoices: Invoice[];
}
