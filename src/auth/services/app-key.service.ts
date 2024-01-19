import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';

import { AppKey } from '../entities/app-key.entity';
import { CreateAppKeyDto } from '../dtos/app-key.dtos';

@Injectable()
export class AppKeyService {
  constructor(
    @InjectRepository(AppKey)
    private appKeyRepo: Repository<AppKey>,
  ) {}

  async findAll() {
    return await this.appKeyRepo.find({
      order: { id: 'ASC' },
    });
  }

  async validateAppKey(appkey: string): Promise<boolean> {
    const appkeyEntity = await this.appKeyRepo.findOne({
      where: { key: appkey },
    });
    if (!appkeyEntity) {
      return false;
    }
    return appkey === appkeyEntity.key;
  }

  async create(data: CreateAppKeyDto) {
    const newAppKey = this.appKeyRepo.create(data);
    const randomBytes = crypto.randomBytes(32);
    newAppKey.key = randomBytes.toString('hex');
    return await this.appKeyRepo.save(newAppKey);
  }

  async delete(id: number) {
    return await this.appKeyRepo.delete(id);
  }
}
