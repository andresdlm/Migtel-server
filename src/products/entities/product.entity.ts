import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';
import { InvoiceProductRelation } from '../../invoices/entities/invoice-product-relation.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 500 })
  name: string;

  @Column({ name: 'invoice_description', type: 'varchar', length: 500 })
  invoiceDescription: string;

  @Column({ name: 'price', type: 'real' })
  price: number;

  @Column({ name: 'archive', type: 'boolean', default: false })
  archive: boolean;

  @OneToMany(
    () => InvoiceProductRelation,
    (invoiceProductRelation) => invoiceProductRelation.product,
  )
  invoiceProductRelation: InvoiceProductRelation[];
}
