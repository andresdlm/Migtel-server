import { Controller, Get } from '@nestjs/common';

import { DashboardService } from '../services/dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('')
  getDashboard() {
    return this.dashboardService.generateDashboard();
  }
}
