import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { NotifyController } from './controllers/notify.controller';
import { NotifyService } from './services/notify.service';
import { BlacklistService } from './services/blacklist.service';

@Module({
  imports: [HttpModule],
  controllers: [NotifyController],
  providers: [NotifyService, BlacklistService],
  exports: [NotifyService, BlacklistService],
})
export class NotifyApiModule {}
