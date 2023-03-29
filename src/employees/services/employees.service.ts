import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Employee } from '../entities/employee.entity';
import {
  CreateEmployeeDto,
  FilterEmployeeDto,
  UpdateEmployeeDto,
} from '../dtos/employee.dtos';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>,
  ) {}

  async findAll(params?: FilterEmployeeDto) {
    if (params) {
      const { limit, offset, getActive } = params;
      return await this.employeeRepo.find({
        order: { id: 'DESC' },
        take: limit,
        skip: offset,
        where: { active: getActive },
      });
    }
    return await this.employeeRepo.find({
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const employee = await this.employeeRepo.findOne({
      where: {
        id: id,
      },
    });
    if (!employee) {
      throw new NotFoundException(`Employee #${id} not found`);
    }
    return employee;
  }

  async create(data: CreateEmployeeDto) {
    const newEmployee = this.employeeRepo.create(data);
    return await this.employeeRepo.save(newEmployee);
  }

  async update(id: number, changes: UpdateEmployeeDto) {
    const employee = await this.findOne(id);
    this.employeeRepo.merge(employee, changes);
    return await this.employeeRepo.save(employee);
  }

  async deactivate(id: number) {
    const product = await this.findOne(id);
    product.active = !product.active;
    return await this.employeeRepo.save(product);
  }
}
