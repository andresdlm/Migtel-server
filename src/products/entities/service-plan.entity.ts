import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'service_plans' })
export class ServicePlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'invoice_label', type: 'varchar', length: 100 })
  invoiceLabel: string;

  @Column({ name: 'service_plan_type', type: 'varchar', length: 100 })
  servicePlanType: string;

  @Column({ type: 'numeric' })
  price: number;

  @Column({ type: 'boolean', default: false })
  archived: boolean;

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
