import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Invoice } from './invoice.entity';

@Entity({ name: 'invoice_product_relation' })
export class InvoiceProductRelation {
  @ManyToOne(() => Invoice, (invoice) => invoice.invoiceProductRelation)
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @Column({ name: 'invoice_id', primary: true })
  invoiceId: number;

  @ManyToOne(() => Product, (product) => product.invoiceProductRelation)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'product_id', primary: true })
  productId: number;

  @Column({ name: 'product_name', type: 'varchar' })
  productName: string;

  @Column()
  count: number;

  @Column({ type: 'real' })
  price: number;
}
