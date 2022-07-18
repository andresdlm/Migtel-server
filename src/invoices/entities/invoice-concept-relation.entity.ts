import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { InvoiceConcept } from './invoice-concept.entity';
import { Invoice } from './invoice.entity';

@Entity({ name: 'invoice_concepts_relation' })
export class InvoiceConceptRelation {
  @Column()
  count: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.invoiceConceptRelation)
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @Column({ name: 'invoice_id', primary: true })
  invoiceId: number;

  @ManyToOne(
    () => InvoiceConcept,
    (invoiceConcept) => invoiceConcept.invoiceConceptRelation,
  )
  @JoinColumn({ name: 'invoice_concept_id' })
  invoiceConcept: InvoiceConcept;

  @Column({ name: 'invoice_concept_id', primary: true })
  invoiceConceptId: number;
}
