import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientsController } from './controllers/clients.controller';
import { ClientsService } from './services/clients.service';
import { Clients } from './entities/client.entity';
import { ServicesClientController } from './controllers/services-client.controller';
import { ServicesClientService } from './services/services-client.service';
import { ServicesClient } from './entities/service-client.entity';

@Module({
  controllers: [ClientsController, ServicesClientController],
  providers: [ClientsService, ServicesClientService],
  imports: [TypeOrmModule.forFeature([Clients, ServicesClient])],
})
export class ClientsModule {}
