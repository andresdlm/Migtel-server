import { Body, Controller, Post, StreamableFile } from '@nestjs/common';
import { ReportDto } from '../dtos/reports.dtos';
import { SalesBookDto } from '../dtos/salesBook.dtos';
import { ReportsService } from '../services/reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post('libroventas.pdf')
  async getAllSalesReport(@Body() payload: SalesBookDto) {
    const data = await this.reportsService.getBookReports(payload);
      
    return data;
  }

  @Post('paymentReport.pdf')
  async getAllAccountReport(@Body() payload: ReportDto) {
    const data = await this.reportsService.getPaymentReport(payload)

    return data;
  }
}