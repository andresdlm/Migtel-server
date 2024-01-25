import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { Employee } from '../entities/employee.entity';
import {
  CreateEmployeeDto,
  FilterEmployeeDto,
  UpdateEmployeeDto,
} from '../dtos/employee.dtos';
import { isNumber } from 'class-validator';

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
        order: { firstname: 'ASC' },
        take: limit,
        skip: offset,
        relations: {
          department: true,
        },
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
      relations: {
        user: true,
        department: true,
      },
    });
    if (!employee) {
      throw new NotFoundException(`Employee #${id} not found`);
    }
    return employee;
  }

  async findEmployeesWithoutUser() {
    return await this.employeeRepo.query(`
      SELECT employees.id, firstname, lastname, document
      FROM employees
      LEFT OUTER JOIN users e on employees.id = e.employee_id
      WHERE e.id IS NULL`);
  }

  async getCount(getActive: boolean) {
    return await this.employeeRepo.count({
      where: { active: getActive },
    });
  }

  async search(searchInput: string, getArchive: boolean) {
    if (isNumber(Number(searchInput))) {
      return await this.employeeRepo.find({
        where: [{ id: Number(searchInput), active: getArchive }],
        take: 20,
        relations: {
          department: true,
        },
      });
    } else {
      return await this.employeeRepo.find({
        where: [
          {
            firstname: ILike(`%${searchInput}%`),
            active: getArchive,
          },
          {
            lastname: ILike(`%${searchInput}%`),
            active: getArchive,
          },
          {
            email: ILike(`%${searchInput}%`),
            active: getArchive,
          },
          {
            document: ILike(`%${searchInput}%`),
            active: getArchive,
          },
          {
            city: ILike(`%${searchInput}%`),
            active: getArchive,
          },
          {
            position: ILike(`%${searchInput}%`),
            active: getArchive,
          },
        ],
        take: 20,
        relations: {
          department: true,
        },
      });
    }
  }

  async create(data: CreateEmployeeDto) {
    const newEmployee = this.employeeRepo.create(data);
    return await this.employeeRepo.save(newEmployee);
  }

  async update(id: number, changes: UpdateEmployeeDto) {
    const employee = await this.employeeRepo.findOneBy({ id: id });
    if (!employee) {
      throw new NotFoundException(`Employee #${id} not found`);
    }
    this.employeeRepo.merge(employee, changes);
    return await this.employeeRepo.save(employee);
  }

  async deactivate(id: number) {
    const employee = await this.findOne(id);
    employee.active = !employee.active;
    return await this.employeeRepo.save(employee);
  }
}
