/* eslint-disable prettier/prettier */
import { PrimaryColumn, Column, Entity } from "typeorm";

@Entity()
export class ServicePlans {
  @PrimaryColumn()
  id: number;

  @Column({type: 'varchar', length: 100})
  name: string;

  @Column({type: 'varchar', length: 100})
  invoiceLabel: string;

  @Column({type: 'varchar', length: 100})
  servicePlanType: string;

  @Column({type: 'float'})
  price: number;

  @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  created_at: Date;
}
