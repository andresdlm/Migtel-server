import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientsController } from './controllers/clients.controller';
import { ClientsService } from './services/clients.service';
import { Client } from './entities/client.entity';
import { ClientServicesController } from './controllers/client-services.controller';
import { ClientServicesService } from './services/client-services.service';
import { ClientService } from './entities/client-service.entity';

import { ServicePlansModule } from 'src/service-plans/service-plans.module';

@Module({
  controllers: [ClientsController, ClientServicesController],
  providers: [ClientsService, ClientServicesService],
  imports: [
    TypeOrmModule.forFeature([Client, ClientService]),
    ServicePlansModule,
  ],
  exports: [ClientsService, ClientServicesService],
})
export class ClientsModule {}
