/* eslint-disable prettier/prettier */
import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { Invoices } from './invoice.entity';
import { ServicesClient } from 'src/clients/entities/service-client.entity';

@Entity()
export class ConceptsInvoice {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Invoices, (invoice) => invoice.concepts)
  invoice: Invoices;

  @Column()
  invoiceInvoiceNumber: number;

  @ManyToOne(() => ServicesClient, (servicesClient) => servicesClient.invoiceConcept)
  serviceClient: ServicesClient;

  @Column()
  serviceClientId: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  create_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  update_at: Date;
}
