import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientsController } from './controllers/clients.controller';
import { ClientsService } from './services/clients.service';
import { Client } from './entities/client.entity';

import { ServicePlansModule } from 'src/service-plans/service-plans.module';

@Module({
  controllers: [ClientsController],
  providers: [ClientsService],
  imports: [TypeOrmModule.forFeature([Client]), ServicePlansModule],
  exports: [ClientsService],
})
export class ClientsModule {}
