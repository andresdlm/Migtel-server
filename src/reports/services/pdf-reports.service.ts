import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  PaymentReportDto,
  PortalReportDto,
  ReferenceDto,
  ReportDto,
  SalesBookReportDto,
} from '../dtos/reports.dtos';
import {
  IgtfBook,
  PaidInvoice,
  PaymentReport,
  PortalPaymentReport,
  ReferenceInvoice,
  ReferencePayment,
  SalesBookReport,
} from '../models/pdf';
import * as PdfReport from './pdf-reports';
import { ReportsService } from './reports.service';

@Injectable()
export class PdfReportsService {
  constructor(
    private reportsService: ReportsService,
    private salesBookPdfService: PdfReport.SalesBookService,
    private accountReportPdfService: PdfReport.AccountService,
    private paymentPdfService: PdfReport.PaymentService,
    private retentionsReportPdfService: PdfReport.RetentionsService,
    private referenceInvoiceReportPdfService: PdfReport.ReferenceInvoiceService,
    private referencePaymentReportPdfService: PdfReport.ReferencePaymentService,
    private igtfReportPdfService: PdfReport.IgtfService,
    private notPaidInvoicePdfService: PdfReport.NotPaidInvoiceService,
    private conciliationInvoicePdfService: PdfReport.ConciliationInvoiceService,
    private portalPaymentReportPdfService: PdfReport.PortalPaymentService,
  ) {}

  async getSalesBookReport(params: SalesBookReportDto, fileName?: string) {
    const report = await this.reportsService.getSalesBookReport(params);
    // When params is send to getSalesBookReport it's adding +1 to the date so when params.until is printed on the pdf it's 1 day after
    params.until.setDate(params.until.getDate() - 1);
    const pdf = await this.salesBookPdfService.generate(
      report,
      params,
      fileName,
    );
    return pdf;
  }

  async getAccountReport(params: ReportDto, fileName?: string) {
    const report = await this.reportsService.getAccountReport(params);
    params.until.setDate(params.until.getDate() - 1);
    const pdf = await this.accountReportPdfService.generate(
      report,
      params,
      fileName,
    );
    return pdf;
  }

  async getAccountPaymentReport(params: ReportDto, fileName?: string) {
    const report = await this.reportsService.getAccountPaymentReport(params);
    params.until.setDate(params.until.getDate() - 1);
    const pdf = await this.accountReportPdfService.generate(
      report,
      params,
      fileName,
    );
    return pdf;
  }

  async getPaymentReport(params: PaymentReportDto, fileName?: string) {
    const report = await this.reportsService.getPaymentReport(params);
    const typedReport: PaymentReport = {
      report: report[0],
      summary: report[1],
    };
    params.until.setDate(params.until.getDate() - 1);
    const pdf = await this.paymentPdfService.generate(
      typedReport,
      params,
      fileName,
    );
    return pdf;
  }

  async getRetentionsReport(params: ReportDto, fileName?: string) {
    const report = await this.reportsService.getRetentionsReport(params);
    params.until.setDate(params.until.getDate() - 1);
    const pdf = await this.retentionsReportPdfService.generate(
      report,
      params,
      fileName,
    );
    return pdf;
  }

  async getReferenceInvoiceReport(params: ReferenceDto, fileName?: string) {
    const report: ReferenceInvoice =
      await this.reportsService.getReferenceInvoiceReport(params);
    params.until.setDate(params.until.getDate() - 1);
    const pdf = await this.referenceInvoiceReportPdfService.generate(
      report,
      params,
      fileName,
    );
    return pdf;
  }

  async getReferencePaymentReport(params: ReferenceDto, fileName?: string) {
    const report: ReferencePayment =
      await this.reportsService.getReferencePaymentReport(params);
    params.until.setDate(params.until.getDate() - 1);
    const pdf = await this.referencePaymentReportPdfService.generate(
      report,
      params,
      fileName,
    );
    return pdf;
  }

  async getIgtfReport(params: ReportDto, fileName?: string) {
    const report: IgtfBook =
      await this.reportsService.getIgtfBookReport(params);
    params.until.setDate(params.until.getDate() - 1);
    const pdf = await this.igtfReportPdfService.generate(
      report,
      params,
      fileName,
    );
    return pdf;
  }

  async getNotPaidInvoiceReport(fileName?: string) {
    const report = await this.reportsService.getPaidInvoiceReport();
    const typedReport: PaidInvoice = {
      report: report.report,
      summary: report.summary,
    };
    const params = {};
    const pdf = await this.notPaidInvoicePdfService.generate(
      typedReport,
      params,
      fileName,
    );
    return pdf;
  }

  async getConciliationInvoiceReport(
    params: SalesBookReportDto,
    fileName?: string,
  ) {
    const report: SalesBookReport =
      await this.reportsService.getConciliationReport(params);
    // params.until.setDate(params.until.getDate() - 1);
    const pdf = await this.conciliationInvoicePdfService.generate(
      report,
      params,
      fileName,
    );
    return pdf;
  }

  async getPortalPaymentReport(params: PortalReportDto, fileName?: string) {
    const report = await this.reportsService.getPortalPaymentReport(params);
    const reportRes: PortalPaymentReport = await firstValueFrom(report);
    // params.until.setDate(params.until.getDate() - 1);
    const pdf = await this.portalPaymentReportPdfService.generate(
      reportRes,
      params,
      fileName,
    );
    return pdf;
  }
}
