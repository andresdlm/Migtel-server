import { Body, Controller, Post, StreamableFile } from '@nestjs/common';
import { ReportDto } from '../dtos/reports.dtos';
import { SalesBookDto } from '../dtos/salesBook.dtos';
import { ReportsService } from '../services/reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post('libroventas.pdf')
  async getFile(@Body() payload: SalesBookDto): Promise<StreamableFile> {
    const buffer = await this.reportsService.generateSalesBookPDF(payload);

    return new StreamableFile(buffer);
  }

  @Post('paymentReport.pdf')
  async paymentReport(@Body() payload: ReportDto): Promise<StreamableFile> {
    const buffer = await this.reportsService.generatePaymentReport(payload);

    return new StreamableFile(buffer);
  }
}
