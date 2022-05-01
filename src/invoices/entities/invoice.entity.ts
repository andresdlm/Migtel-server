/* eslint-disable prettier/prettier */
import { PrimaryColumn, Column, Entity } from "typeorm";

@Entity()
export class Invoices {
  @PrimaryColumn()
  invoice_number: number;

  @Column({type: 'int'})
  client_id: number;

  @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  register_date: Date;

  @Column({type: 'int'})
  group: number;

  @Column({type: 'int'})
  coc: number;

  @Column({type: 'real'})
  subtotal: number;

  @Column({type: 'real'})
  iva: number;

  @Column({type: 'real'})
  iva_r: number;

  @Column({type: 'real'})
  iva_p: number;

  @Column({type: 'real'})
  islr: number;

  @Column({type: 'real'})
  igtf: number;

  @Column({type: 'real'})
  total_amount: number;

  @Column({type: 'real'})
  exhange_rate: number;

  @Column({type: 'varchar', length: 500})
  comment: string;

  @Column({type: 'boolean', default: false})
  canceled: boolean;
}
