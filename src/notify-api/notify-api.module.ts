import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { NotifyController } from './controllers/notify.controller';
import { NotifyService } from './services/notify.service';
import { LoggerModule } from 'src/logger/logger.module';
import { BlacklistService } from './services/blacklist.service';
import { NotifyGateway } from './gateways/notify.gateway';

@Module({
  imports: [HttpModule, LoggerModule],
  controllers: [NotifyController],
  providers: [NotifyService, BlacklistService, NotifyGateway],
  exports: [NotifyService, BlacklistService, NotifyGateway],
})
export class NotifyApiModule {}
