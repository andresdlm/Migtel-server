import { Body, Controller, Post } from '@nestjs/common';
import { PaymentReportDto, ReferenceDto, ReportDto, SalesBookCityReportDto, SalesBookReportDto } from '../dtos/reports.dtos';
import { ReportsService } from '../services/reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post('salesBook')
  async getSalesBookReport(@Body() payload: SalesBookReportDto) {
    return await this.reportsService.getSalesBookReport(payload);
  }

  @Post('salesBookCity')
  async getSalesBookCityReport(@Body() payload: SalesBookCityReportDto) {
    return await this.reportsService.getSalesBookCityReport(payload);
  }

  @Post('accountReport')
  async getAllAccount(@Body() payload: ReportDto) {
    return await this.reportsService.getAccountReport(payload);
  }

  @Post('accountPaymentReport')
  async getAccountPaymentReport(@Body() payload: ReportDto) {
    return await this.reportsService.getAccountPaymentReport(payload);
  }

  @Post('paymentReport')
  async getPaymentReport(@Body() payload: PaymentReportDto) {
    return await this.reportsService.getPaymentReport(payload);
  }

  @Post('retentionsReport')
  async getRetentionsReport(@Body() payload: ReportDto) {
    return await this.reportsService.getRetentionsReport(payload);
  }

  @Post('referenceInvoiceReport')
  async getReferencePaymentReport(@Body() payload: ReferenceDto) {
    return await this.reportsService.getReferenceInvoiceReport(payload);
  }

  @Post('referencePaymentReport')
  async getReferenceInvoiceReport(@Body() payload: ReferenceDto) {
    return await this.reportsService.getReferencePaymentReport(payload);
  }

  @Post('igtfBook')
  async getIgtfBookReport(@Body() payload: ReportDto) {
    return await this.reportsService.getIgtfBookReport(payload);
  }
}
