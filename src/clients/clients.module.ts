import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { ClientsController } from './controllers/clients.controller';
import { ClientsService } from './services/clients.service';
import { Client } from './entities/client.entity';

@Module({
  controllers: [ClientsController],
  providers: [ClientsService],
  imports: [HttpModule, TypeOrmModule.forFeature([Client])],
  exports: [ClientsService],
})
export class ClientsModule {}
