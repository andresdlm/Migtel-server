import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Invoice } from './invoice.entity';

@Entity({ name: 'invoice_service_relation' })
export class InvoiceServiceRelation {
  @ManyToOne(() => Invoice, (invoice) => invoice.invoiceServiceRelation)
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @Column({ name: 'invoice_id', primary: true })
  invoiceId: number;

  @Column({ name: 'service_id', primary: true })
  serviceId: number;

  @Column({ name: 'service_plan_id', type: 'int' })
  servicePlanId: number;

  @Column({ name: 'service_plan_name', type: 'varchar' })
  servicePlanName: string;

  @Column({ name: 'count', type: 'int' })
  count: number;

  @Column({ name: 'price', type: 'real' })
  price: number;
}
