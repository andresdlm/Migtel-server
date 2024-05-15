import { Controller, UseGuards, Post, Body, Get } from '@nestjs/common';

import { NotifyService } from '../services/notify.service';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';
import {
  MassByTagDTO,
  MassSMSDTO,
  PaymentRecievedSMSDTO,
  SingleSMSDTO,
} from '../dtos/notify.dtos';
import { FilterByTags } from '../dtos/filter.dtos';

@UseGuards(ApiKeyGuard, JwtAuthGuard, RolesGuard)
@Controller('notify')
export class NotifyController {
  constructor(private notifyService: NotifyService) {}

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COMMUNICATOR)
  @Post('singleSMS')
  singleSMS(@Body() payload: SingleSMSDTO) {
    return this.notifyService.singleSMS(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COMMUNICATOR)
  @Post('massSMS')
  massSMS(@Body() payload: MassSMSDTO) {
    return this.notifyService.massSMS(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COMMUNICATOR)
  @Post('paymentRecievedSMS')
  paymentRecievedSMS(@Body() payload: PaymentRecievedSMSDTO) {
    return this.notifyService.paymentRecievedSMS(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COMMUNICATOR)
  @Get('getClientTags')
  getClientTags() {
    return this.notifyService.getClientTags();
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COMMUNICATOR)
  @Post('getFilteredClients')
  getFilteredClients(@Body() payload: FilterByTags) {
    return this.notifyService.getFilteredClients(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COMMUNICATOR)
  @Post('massByTagSMS')
  massByTagSMS(@Body() payload: MassByTagDTO) {
    return this.notifyService.massByTagSMS(payload);
  }
}
