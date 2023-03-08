import { Exclude } from 'class-transformer';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'payment_methods' })
export class PaymentMethod {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'int' })
  coc: number;

  @Column({ type: 'varchar', length: 100 })
  crmId: string;

  @Column({ name: 'has_igtf', type: 'boolean' })
  hasIgtf: boolean;

  @Column({ type: 'boolean', default: false })
  archived: boolean;

  @Exclude()
  @OneToMany(() => Invoice, (invoice) => invoice.paymentMethod)
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
