/* eslint-disable prettier/prettier */
import { Invoices } from 'src/invoices/entities/invoice.entity';
import {
  PrimaryColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ServicesClient } from './service-client.entity';

@Entity()
export class Clients {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 10, default: 'V' })
  person_type: string;

  @Column({ type: 'varchar', length: 20 })
  document: string;

  @Column({ type: 'varchar', length: 500 })
  address: string;

  @Column({ type: 'int' })
  retention: number;

  @OneToMany(() => ServicesClient, (service) => service.client)
  services: ServicesClient[];

  @OneToMany(() => Invoices, (invoices) => invoices.client)
  invoices: Invoices[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  create_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  update_at: Date;
}
