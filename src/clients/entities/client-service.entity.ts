import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
  ManyToMany,
} from 'typeorm';
import { Client } from './client.entity';
import { ServicePlan } from 'src/service-plans/entities/service-plan.entity';
import { Invoice } from 'src/invoices/entities/invoice.entity';

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

  @ManyToMany(() => Invoice, (invoices) => invoices.clientsServices)
  invoices: Invoice[];

  @CreateDateColumn({
    name: 'create_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @UpdateDateColumn({
    name: 'update_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;
}
