import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { ClientService } from './client-service.entity';

@Entity({ name: 'clients' })
export class Client {
  @PrimaryGeneratedColumn()
  id: number; // Listo

  @Column({ type: 'varchar', length: 200 })
  name: string; // Listo

  @Column({ type: 'varchar', length: 20 })
  phone: string; //

  @Column({ name: 'person_type', type: 'varchar', length: 10, default: 'V' })
  personType: string;

  @Column({ type: 'varchar', length: 20 })
  document: string; // Listo

  @Column({ type: 'varchar', length: 500 })
  address: string; //

  @Column({ type: 'varchar', length: 100 })
  city: string; // Listo

  @Column({ type: 'int' })
  retention: number;

  @Column({ name: 'has_islr', type: 'boolean' })
  hasIslr: boolean;

  @Column({ name: 'amount_islr', type: 'int' })
  amountIslr: number;

  @Column({ type: 'boolean', default: false })
  archived: boolean;

  @OneToMany(() => ClientService, (service) => service.client)
  services: ClientService[];

  @OneToMany(() => Invoice, (invoice) => invoice.client)
  invoices: Invoice[];

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
