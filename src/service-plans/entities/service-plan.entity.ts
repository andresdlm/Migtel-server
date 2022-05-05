import {
  PrimaryColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ClientService } from 'src/clients/entities/client-service.entity';

@Entity({ name: 'service_plans' })
export class ServicePlan {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'invoice_label', type: 'varchar', length: 100 })
  invoiceLabel: string;

  @Column({ name: 'service_plan_type', type: 'varchar', length: 100 })
  servicePlanType: string;

  @Column({ type: 'float' })
  price: number;

  @OneToMany(() => ClientService, (clientService) => clientService.servicePlan)
  clientServices: ClientService[];

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
