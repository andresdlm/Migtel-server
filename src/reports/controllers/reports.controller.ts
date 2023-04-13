import { Body, Controller, Post, StreamableFile } from '@nestjs/common';
import { ReportDto } from '../dtos/reports.dtos';
import { SalesBookDto } from '../dtos/salesBook.dtos';
import { ReportsService } from '../services/reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}
}
