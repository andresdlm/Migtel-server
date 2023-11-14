import { Controller, Get, UseGuards } from '@nestjs/common';

import { DashboardService } from '../services/dashboard.service';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(ApiKeyGuard, JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('')
  getDashboard() {
    return this.dashboardService.generateDashboard();
  }
}
