import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { ClientsController } from './controllers/clients.controller';
import { ClientsService } from './services/clients.service';
import { Client } from './entities/client.entity';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  controllers: [ClientsController],
  providers: [ClientsService],
  imports: [HttpModule, TypeOrmModule.forFeature([Client]), LoggerModule],
  exports: [ClientsService],
})
export class ClientsModule {}
