/* eslint-disable prettier/prettier */
import {
  PrimaryColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { ServicesClient } from 'src/clients/entities/service-client.entity';

@Entity()
export class ServicePlans {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  invoiceLabel: string;

  @Column({ type: 'varchar', length: 100 })
  servicePlanType: string;

  @Column({ type: 'float' })
  price: number;

  @OneToMany(() => ServicesClient, (serviceClient) => serviceClient.servicePlan)
  servicesClients: ServicesClient[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  create_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  update_at: Date;
}
