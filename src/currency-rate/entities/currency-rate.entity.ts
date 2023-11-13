import { ColumnNumericTransformer } from 'src/common/colum-numeric-transformer';
import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'currency_rates' })
export class CurrencyRate {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 4 })
  currency: string;

  @Column({ type: 'numeric', transformer: new ColumnNumericTransformer() })
  price: number;

  @CreateDateColumn({
    name: 'consulted_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  consultedAt: Date;
}
