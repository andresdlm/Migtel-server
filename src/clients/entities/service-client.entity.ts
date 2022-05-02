/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { Clients } from './client.entity';
import { ServicePlans } from 'src/service-plans/entities/service-plan.entity';
import { ConceptsInvoice } from 'src/invoices/entities/concepts-invoice.entity';

@Entity()
export class ServicesClient {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Clients, (client) => client.services)
  client: Clients;

  @ManyToOne(() => ServicePlans, (servicePlan) => servicePlan.servicesClients)
  servicePlan: ServicePlans;

  @OneToMany(() => ConceptsInvoice, (conceptsInvoice) => conceptsInvoice.serviceClient)
  invoiceConcept: ConceptsInvoice[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  create_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  update_at: Date;
}
