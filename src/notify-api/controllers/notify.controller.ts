import { Controller, UseGuards, Post, Body } from '@nestjs/common';

import { NotifyService } from '../services/notify.service';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';
import { MassSMSDTO, SingleSMSDTO } from '../dtos/notify.dtos';

@UseGuards(ApiKeyGuard, JwtAuthGuard, RolesGuard)
@Controller('notify')
export class NotifyController {
  constructor(private notifyService: NotifyService) {}

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @Post('singleSMS')
  singleSMS(@Body() payload: SingleSMSDTO) {
    return this.notifyService.singleSMS(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @Post('massSMS')
  massSMS(@Body() payload: MassSMSDTO) {
    return this.notifyService.massSMS(payload);
  }
}
