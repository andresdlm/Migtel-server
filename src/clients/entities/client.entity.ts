import { PrimaryColumn, Column, Entity, OneToMany } from 'typeorm';
import { Invoice } from 'src/invoices/entities/invoice.entity';

@Entity({ name: 'clients' })
export class Client {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  retention: number;

  @Column({ name: 'amount_islr', type: 'int', default: 0 })
  amountIslr: number;

  @OneToMany(() => Invoice, (invoice) => invoice.client)
  invoices: Invoice[];
}
