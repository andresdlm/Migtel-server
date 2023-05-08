import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Department } from '../entities/department.entity';
import {
  CreateDepartmentDto,
  FilterDepartmentDto,
  UpdateDepartmentDto,
} from '../dtos/department.dtos';
import { isNumber } from 'class-validator';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private departmentRepo: Repository<Department>,
  ) {}

  async findAll(params?: FilterDepartmentDto) {
    if (params) {
      const { limit, offset } = params;
      return await this.departmentRepo.find({
        order: { id: 'DESC' },
        take: limit,
        skip: offset,
      });
    }
    return await this.departmentRepo.find({
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const department = await this.departmentRepo.findOne({
      where: {
        id: id,
      },
    });
    if (!department) {
      throw new NotFoundException(`Department #${id} not found`);
    }
    return department;
  }

  getCount() {
    return this.departmentRepo.count();
  }

  async search(searchInput: string) {
    if (isNumber(Number(searchInput))) {
      return this.departmentRepo.find({
        where: [{ id: Number(searchInput) }],
        take: 10,
      });
    } else {
      return this.departmentRepo.find({
        where: [
          {
            name: ILike(`%${searchInput}%`),
          },
        ],
        take: 10,
      });
    }
  }

  async create(data: CreateDepartmentDto) {
    const newDepartment = this.departmentRepo.create(data);
    return await this.departmentRepo.save(newDepartment);
  }

  async update(id: number, changes: UpdateDepartmentDto) {
    const department = await this.findOne(id);
    this.departmentRepo.merge(department, changes);
    return await this.departmentRepo.save(department);
  }
}
