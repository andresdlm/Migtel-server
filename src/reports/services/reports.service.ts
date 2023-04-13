import { Injectable } from '@nestjs/common';

import { ReportsLogicService } from './reports-logic.service';
import { SalesBookDto } from '../dtos/salesBook.dtos';
import { ReportDto } from '../dtos/reports.dtos';

@Injectable()
export class ReportsService {
  constructor(private reportsLogicService: ReportsLogicService) {}

  async getBookReports(params: SalesBookDto) {
    return await this.reportsLogicService.generateSalesBook(params);
  }

  async getPaymentReport(params: ReportDto) {
    return await this.reportsLogicService.paymentMethodReport(params);
  }
}
