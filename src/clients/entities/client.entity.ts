/* eslint-disable prettier/prettier */
import { PrimaryColumn, Column, Entity, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Clients {
  @PrimaryColumn()
  id: number;

  @Column({type: 'varchar', length: 200})
  name: string;

  @Column({type: 'varchar', length: 10, default: 'V'})
  person_type: string;

  @Column({type: 'varchar', length: 20})
  document: string;

  @Column({type: 'varchar', length: 500})
  address: string;

  @Column({type: 'int'})
  retention: number;

  @CreateDateColumn({type: 'timestamptz', default: () => "CURRENT_TIMESTAMP"})
  create_at: Date;

  @UpdateDateColumn({type: 'timestamptz', default: () => "CURRENT_TIMESTAMP"})
  update_at: Date;
}
