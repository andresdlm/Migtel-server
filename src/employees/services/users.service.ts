import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { isNumber } from 'class-validator';
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

  async findAll(params?: FilterUsersDto) {
    if (params) {
      const { limit, offset, getLocked } = params;
      return await this.userRepo.find({
        order: { id: 'DESC' },
        take: limit,
        skip: offset,
        where: { isLocked: getLocked },
      });
    }
    return await this.userRepo.find({
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: {
        id: id,
      },
      relations: {
        employee: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async findByUsername(username: string) {
    return await this.userRepo.findOneBy({ username: username });
  }

  async getCount(isLocked: boolean) {
    return await this.userRepo.count({
      where: { isLocked: isLocked },
    });
  }

  async search(searchInput: string) {
    if (isNumber(Number(searchInput))) {
      return await this.userRepo.find({
        where: [{ id: Number(searchInput) }],
        take: 20,
      });
    } else {
      return await this.userRepo.find({
        where: [
          {
            username: ILike(`%${searchInput}%`),
          },
          {
            role: ILike(`%${searchInput}%`),
          },
        ],
        take: 20,
      });
    }
  }

  async create(data: CreateUserDto) {
    const newUser = this.userRepo.create(data);
    const hashPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashPassword;
    return await this.userRepo.save(newUser);
  }

  async update(id: number, changes: UpdateUserDto) {
    const user = await this.userRepo.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    const hashPassword = await bcrypt.hash(changes.password, 10);
    this.userRepo.merge(user, changes);
    user.password = hashPassword;
    return this.userRepo.save(user);
  }

  async switchLock(id: number) {
    const user = await this.userRepo.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    if (user.failedLoginAttempts >= 3) {
      throw new ForbiddenException(
        'User account is locked due to multiple failed login attempts. Please reset the password to unlock the account.',
      );
    }
    user.isLocked = !user.isLocked;
    return await this.userRepo.save(user);
  }

  async remove(id: number) {
    return await this.userRepo.delete(id);
  }

  async incrementFailedAttempts(userId: number): Promise<void> {
    await this.userRepo.increment({ id: userId }, 'failedLoginAttempts', 1);
  }

  async resetFailedAttempts(userId: number): Promise<void> {
    await this.userRepo.update(userId, {
      failedLoginAttempts: 0,
      isLocked: false,
    });
  }

  async lockUser(userId: number): Promise<void> {
    await this.userRepo.update(userId, { isLocked: true });
  }

  async unlockUser(userId: number): Promise<void> {
    await this.userRepo.update(userId, {
      failedLoginAttempts: 0,
      isLocked: false,
    });
  }
}
