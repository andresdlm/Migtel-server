import { PrimaryColumn, Column, Entity } from 'typeorm';

@Entity({ name: 'clients' })
export class Client {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  retention: number;

  @Column({ name: 'amount_islr', type: 'int', default: 0 })
  amountIslr: number;

  @Column({ name: 'other_retentions', type: 'int', default: 0 })
  otherRetentions: number;
}
