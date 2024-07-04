import { Injectable } from '@nestjs/common';
import { json2csv } from 'json-2-csv';

import { ReportsService } from './reports.service';
import {
  PaymentReportDto,
  PortalReportDto,
  ReferenceDto,
  ReportDto,
  SalesBookReportDto,
} from '../dtos/reports.dtos';

@Injectable()
export class CsvReportsService {
  constructor(private reportsService: ReportsService) {}

  async getSalesBookReport(params: SalesBookReportDto) {
    const salesBook = await this.reportsService.getSalesBookReport(params);
    const csvData = json2csv(salesBook.report);

    return csvData;
  }

  async getAccountReport(params: ReportDto) {
    const accountReport = await this.reportsService.getAccountReport(params);
    const csvData = json2csv(accountReport.report);

    return csvData;
  }

  async getAccountPaymentReport(params: ReportDto) {
    const accountPaymentReport =
      await this.reportsService.getAccountPaymentReport(params);
    const csvData = json2csv(accountPaymentReport.report);

    return csvData;
  }

  async getPaymentReport(params: PaymentReportDto) {
    const paymentReport = await this.reportsService.getPaymentReport(params);
    const csvData = json2csv(paymentReport[0]);

    return csvData;
  }

  async getRetentionReport(params: ReportDto) {
    const retentionReport =
      await this.reportsService.getRetentionsReport(params);
    const csvData = json2csv(retentionReport.report);

    return csvData;
  }

  async getReferenceInvoiceReport(params: ReferenceDto) {
    const referenceReport =
      await this.reportsService.getReferenceInvoiceReport(params);
    const csvData = json2csv(referenceReport.report);

    return csvData;
  }

  async getReferencePaymentReport(params: ReferenceDto) {
    const referencePaymentReport =
      await this.reportsService.getReferencePaymentReport(params);
    const csvData = json2csv(referencePaymentReport.report);

    return csvData;
  }

  async getIgtfBookReport(params: ReportDto) {
    const igtfReport = await this.reportsService.getIgtfBookReport(params);
    const csvData = json2csv(igtfReport.report);

    return csvData;
  }

  async getPaidInvoiceReport() {
    const paidInvoiceReport = await this.reportsService.getPaidInvoiceReport();
    const csvData = json2csv(paidInvoiceReport.report);

    return csvData;
  }

  async getConciliationReport(params: SalesBookReportDto) {
    const conciliationReport =
      await this.reportsService.getConciliationReport(params);
    const csvData = json2csv(conciliationReport.report);

    return csvData;
  }

  async getPortalPaymentReport(params: PortalReportDto) {
    const portalPaymentReport =
      await this.reportsService.getPortalPaymentReport(params);
    const csvData = json2csv(portalPaymentReport['report']);

    return csvData;
  }
}
