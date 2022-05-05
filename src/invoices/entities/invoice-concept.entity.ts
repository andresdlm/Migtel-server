/* eslint-disable prettier/prettier */
import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
} from 'typeorm';
import { Invoice } from './invoice.entity';
import { ClientService } from 'src/clients/entities/client-service.entity';

@Entity({ name: 'invoice_concepts'})
export class InvoiceConcept {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.concepts)
  @JoinColumn({ name: 'invoice_number' })
  invoice: Invoice;

  @Column({ name: 'invoice_number' })
  invoiceNumber: number;

  @ManyToOne(() => ClientService, (clientService) => clientService.invoiceConcept)
  @JoinColumn({ name: 'client_service_id' })
  clientService: ClientService;

  @Column({ name: 'client_service_id' })
  clientServiceId: number;

  @CreateDateColumn({ name: 'create_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @UpdateDateColumn({ name: 'update_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updateAt: Date;
}
