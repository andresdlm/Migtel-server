import { Module } from '@nestjs/common';
import { PortalController } from './controllers/portal.controller';
import { PortalService } from './services/portal.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [PortalController],
  providers: [PortalService],
  exports: [PortalService],
})
export class PortalModule {}
