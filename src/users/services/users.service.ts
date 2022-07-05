import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import {
  CreateUserDto,
  FilterUsersDto,
  UpdateUserDto,
} from '../dtos/user.dtos';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  findAll(params?: FilterUsersDto) {
    if (params) {
      const { limit, offset, getActive } = params;
      return this.userRepo.find({
        order: { id: 'DESC' },
        take: limit,
        skip: offset,
        where: { active: getActive },
      });
    }
    return this.userRepo.find({
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne(id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  async create(data: CreateUserDto) {
    const newUser = this.userRepo.create(data);
    const hashPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashPassword;
    return this.userRepo.save(newUser);
  }

  async update(id: number, changes: UpdateUserDto) {
    const user = await this.findOne(id);
    this.userRepo.merge(user, changes);
    return this.userRepo.save(user);
  }

  async activate(id: number) {
    const user = await this.userRepo.findOne(id);
    user.active = !user.active;
    return this.userRepo.save(user);
  }

  remove(id: number) {
    return this.userRepo.delete(id);
  }
}
