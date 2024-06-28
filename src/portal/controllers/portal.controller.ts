import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';

import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/models/roles.model';
import { UpdateState } from '../dtos/portal.dtos';
import { PortalService } from '../services/portal.service';

@UseGuards(ApiKeyGuard, JwtAuthGuard, RolesGuard)
@Controller('portal')
export class PortalController {
  constructor(private readonly portalService: PortalService) {}

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Get()
  getPaymentMethods() {
    return this.portalService.getPaymentMethods();
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('active/:id')
  updatePaymentMethodState(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateState) {
    return this.portalService.updatePaymentMethodState(id, payload);
  }
}
