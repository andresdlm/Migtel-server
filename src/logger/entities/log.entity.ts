import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'logs' })
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 140 })
  message: string;

  @Column({ type: 'varchar', length: 15 })
  severity: string;

  @Column({ type: 'varchar', length: 80 })
  endpoint: string;

  @Column({ name: 'http_method', type: 'varchar', length: 10 })
  httpMethod: string;

  @Column({ name: 'request_body', type: 'json', nullable: true })
  requestBody: any;

  @Column({ name: 'response_body', type: 'json', nullable: true })
  responseBody: any;

  @Column({ type: 'json', nullable: true })
  jwt: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  stack: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
