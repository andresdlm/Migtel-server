import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, UseInterceptors } from '@nestjs/common';

import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/models/roles.model';
import { UpdateState } from '../dtos/portal.dtos';
import { PortalService } from '../services/portal.service';
import { LogInterceptor } from 'src/logger/interceptors/log.interceptor';

@UseGuards(ApiKeyGuard, JwtAuthGuard, RolesGuard)
@Controller('portal')
export class PortalController {
  constructor(private readonly portalService: PortalService) {}

  @UseInterceptors(LogInterceptor)
  @Roles(Role.SUPER_ADMIN)
  @Get()
  getPaymentMethods() {
    return this.portalService.getPaymentMethods();
  }

  @UseInterceptors(LogInterceptor)
  @Roles(Role.SUPER_ADMIN)
  @Post('active/:id')
  updatePaymentMethodState(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateState) {
    return this.portalService.updatePaymentMethodState(id, payload);
  }
}
