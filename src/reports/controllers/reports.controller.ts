import { Body, Controller, Post } from '@nestjs/common';
import { PaymentReportDto, ReportDto, SalesBookReportDto } from '../dtos/reports.dtos';
import { ReportsService } from '../services/reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post('salesBook')
  async getSalesBookReport(@Body() payload: SalesBookReportDto) {
    return await this.reportsService.getSalesBookReport(payload);
  }

  @Post('accountReport')
  async getAllAccount(@Body() payload: ReportDto) {
    return await this.reportsService.getAccountReport(payload);
  }

  @Post('paymentReport')
  async getPaymentReport(@Body() payload: PaymentReportDto) {
    return await this.reportsService.getPaymentReport(payload);
  }

  @Post('retentionsReport')
  async getRetentionsReport(@Body() payload: ReportDto) {
    return await this.reportsService.getRetentionsReport(payload);
  }
}
