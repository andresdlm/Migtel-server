import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  UseInterceptors,
} from '@nestjs/common';

import { NotifyService } from '../services/notify.service';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';
import {
  MassByTagDTO,
  MassEmailDTO,
  MassSMSDTO,
  PaymentRecievedSMSDTO,
  SingleEmailDTO,
  SingleSMSDTO,
} from '../dtos/notify.dtos';
import { FilterByTags } from '../dtos/filter.dtos';
import { LogInterceptor } from 'src/logger/interceptors/log.interceptor';

@UseGuards(ApiKeyGuard, JwtAuthGuard, RolesGuard)
@Controller('notify')
export class NotifyController {
  constructor(private notifyService: NotifyService) {}

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

  /*******
   * SMS *
   ******/

  @UseInterceptors(LogInterceptor)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COMMUNICATOR)
  @Post('singleSMS')
  singleSMS(@Body() payload: SingleSMSDTO) {
    return this.notifyService.singleSMS(payload);
  }

  @UseInterceptors(LogInterceptor)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COMMUNICATOR)
  @Post('massSMS')
  massSMS(@Body() payload: MassSMSDTO) {
    return this.notifyService.massSMS(payload);
  }

  @UseInterceptors(LogInterceptor)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COMMUNICATOR)
  @Post('paymentRecievedSMS')
  paymentRecievedSMS(@Body() payload: PaymentRecievedSMSDTO) {
    return this.notifyService.paymentRecievedSMS(payload);
  }

  @UseInterceptors(LogInterceptor)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COMMUNICATOR)
  @Post('massByTagSMS')
  massByTagSMS(@Body() payload: MassByTagDTO) {
    return this.notifyService.massByTagSMS(payload);
  }

  /*********
   * Email *
   ********/

  @UseInterceptors(LogInterceptor)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COMMUNICATOR)
  @Post('singleEmail')
  singleEmail(@Body() payload: SingleEmailDTO) {
    return this.notifyService.singleEmail(payload);
  }

  @UseInterceptors(LogInterceptor)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COMMUNICATOR)
  @Post('massEmail')
  massEmail(@Body() payload: MassEmailDTO) {
    return this.notifyService.massEmail(payload);
  }
}
