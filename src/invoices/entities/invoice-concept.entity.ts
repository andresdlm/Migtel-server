import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';
import { InvoiceConceptRelation } from './invoice-concept-relation.entity';

@Entity({ name: 'invoice_concepts' })
export class InvoiceConcept {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'invoice_description', type: 'varchar', length: 500 })
  invoiceDescription: string;

  @Column({ name: 'price', type: 'real' })
  price: number;

  @Column({ name: 'archive', type: 'boolean', default: false })
  archive: boolean;

  @OneToMany(
    () => InvoiceConceptRelation,
    (invoiceConceptRelation) => invoiceConceptRelation.invoiceConcept,
  )
  invoiceConceptRelation: InvoiceConceptRelation[];
}
