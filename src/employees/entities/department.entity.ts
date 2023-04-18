import { Entity, Column, PrimaryGeneratedColumn,OneToMany } from 'typeorm';
import { Employee } from './employee.entity';

@Entity({ name: 'departments' })
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @OneToMany(() => Employee, (employee) => employee.department)
  employees: Employee[];
}
