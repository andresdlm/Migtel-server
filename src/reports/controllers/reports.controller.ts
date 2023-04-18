import { Body, Controller, Post } from '@nestjs/common';
import { ReportDto } from '../dtos/reports.dtos';
import { SalesBookDto } from '../dtos/salesBook.dtos';
import { ReportsService } from '../services/reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post('libroventas.pdf')
  async getAllSales(@Body() payload: SalesBookDto) {
    return await this.reportsService.getBookReports(payload);
  }

  @Post('paymentReport.pdf')
  async getAllAccount(@Body() payload: ReportDto) {
    const data = await this.reportsService.getPaymentReport(payload)

    return data;
  }
}