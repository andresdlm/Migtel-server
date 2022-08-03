import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Client } from './client.entity';
import { ServicePlan } from 'src/service-plans/entities/service-plan.entity';
import { InvoiceServices } from 'src/invoices/entities/invoice-service-relation.entity';

@Entity({ name: 'client_services' })
export class ClientService {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client, (client) => client.services)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({ name: 'client_id' })
  clientId: number;

  @ManyToOne(() => ServicePlan, (servicePlan) => servicePlan.clientServices)
  @JoinColumn({ name: 'service_plan_id' })
  servicePlan: ServicePlan;

  @Column({ name: 'service_plan_id' })
  servicePlanId: number;

  @Column({ name: 'has_individual_price', type: 'boolean' })
  hasIndividualPrice: boolean;

  @Column({ name: 'individual_price', type: 'real', default: 0 })
  individualPrice: number;

  @Column({ type: 'boolean', default: false })
  archived: boolean;

  @OneToMany(
    () => InvoiceServices,
    (invoiceServices) => invoiceServices.clientService,
  )
  invoiceServices: InvoiceServices[];

  @CreateDateColumn({
    name: 'create_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @UpdateDateColumn({
    name: 'update_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;
}
