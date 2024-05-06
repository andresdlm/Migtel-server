import { Injectable } from '@nestjs/common';
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
    const csvData = this.jsonToCsv(salesBook.report);

    return csvData;
  }

  async getAccountReport(params: ReportDto) {
    const accountReport = await this.reportsService.getAccountReport(params);
    const csvData = this.jsonToCsv(accountReport.report);

    return csvData;
  }

  async getAccountPaymentReport(params: ReportDto) {
    const accountPaymentReport =
      await this.reportsService.getAccountPaymentReport(params);
    const csvData = this.jsonToCsv(accountPaymentReport.report);

    return csvData;
  }

  async getPaymentReport(params: PaymentReportDto) {
    const paymentReport = await this.reportsService.getPaymentReport(params);
    const csvData = this.jsonToCsv(paymentReport[0]);

    return csvData;
  }

  async getRetentionReport(params: ReportDto) {
    const retentionReport =
      await this.reportsService.getRetentionsReport(params);
    const csvData = this.jsonToCsv(retentionReport.report);

    return csvData;
  }

  async getReferenceInvoiceReport(params: ReferenceDto) {
    const referenceReport =
      await this.reportsService.getReferenceInvoiceReport(params);
    const csvData = this.jsonToCsv(referenceReport.report);

    return csvData;
  }

  async getReferencePaymentReport(params: ReferenceDto) {
    const referencePaymentReport =
      await this.reportsService.getReferencePaymentReport(params);
    const csvData = this.jsonToCsv(referencePaymentReport.report);

    return csvData;
  }

  async getIgtfBookReport(params: ReportDto) {
    const igtfReport = await this.reportsService.getIgtfBookReport(params);
    const csvData = this.jsonToCsv(igtfReport.report);

    return csvData;
  }

  async getPaidInvoiceReport() {
    const paidInvoiceReport = await this.reportsService.getPaidInvoiceReport();
    const csvData = this.jsonToCsv(paidInvoiceReport.report);

    return csvData;
  }

  async getConciliationReport(params: SalesBookReportDto) {
    const conciliationReport =
      await this.reportsService.getConciliationReport(params);
    const csvData = this.jsonToCsv(conciliationReport.report);

    return csvData;
  }

  async getPortalPaymentReport(params: PortalReportDto) {
    const portalPaymentReport =
      await this.reportsService.getPortalPaymentReport(params);
    const csvData = this.jsonToCsv(portalPaymentReport['report']);

    return csvData;
  }

  private jsonToCsv(jsonArray: any[]): string {
    if (!jsonArray || !jsonArray.length) {
      return '';
    }
    const headers = Object.keys(jsonArray[0]);
    let csv = headers.join(',') + '\n';

    jsonArray.forEach((obj) => {
      const row = headers.map((header) => obj[header]).join(',');
      csv += row + '\n';
    });

    return csv;
  }
}
