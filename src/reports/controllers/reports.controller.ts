import { Body, Controller, Post, StreamableFile } from '@nestjs/common';
import { SalesBookDto } from '../dtos/salesBook.dto';
import { ReportsService } from '../services/reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post('libroventas.pdf')
  async getFile(@Body() payload: SalesBookDto): Promise<StreamableFile> {
    const buffer = await this.reportsService.generateSalesBookPDF(payload);

    return new StreamableFile(buffer);
  }
}
