import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { Exclude } from 'class-transformer';
import { Invoice } from 'src/invoices/entities/invoice.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 12 })
  phone: string;

  @Column({ type: 'varchar', length: 12 })
  document: string;

  @Column({ type: 'varchar', length: 30 })
  city: string;

  @Column({ type: 'timestamp' })
  birthday: Date;

  @Column({ type: 'varchar', length: 100 })
  role: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Exclude()
  @OneToMany(() => Invoice, (invoice) => invoice.user)
  invoices: Invoice[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;
}
