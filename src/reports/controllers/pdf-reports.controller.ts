import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/models/roles.model';
import {
  PaymentReportDto,
  PortalReportDto,
  ReferenceDto,
  ReportDto,
  SalesBookReportDto,
} from '../dtos/reports.dtos';
import { PdfReportsService } from '../services/pdf-reports.service';
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ApiKeyGuard, JwtAuthGuard, RolesGuard)
@Controller('pdf-reports')
export class PdfReportsController {
  constructor(private pdfReportsService: PdfReportsService) {}

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @UseGuards(ThrottlerGuard)
  @Post('salesBook')
  async getSalesBookReport(
    @Body() payload: SalesBookReportDto,
    @Res() res: Response,
  ) {
    const fileName = 'salesBook.pdf';
    await this.pdfReportsService.getSalesBookReport(payload, fileName);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment');
    res.setHeader('filename', fileName);

    const stream = fs.createReadStream(`pdf/${fileName}`);
    stream.pipe(res);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @UseGuards(ThrottlerGuard)
  @Post('accountReport')
  async getAccountReport(@Body() payload: ReportDto, @Res() res: Response) {
    const fileName = 'accountReport.pdf';
    await this.pdfReportsService.getAccountReport(payload, fileName);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment');
    res.setHeader('filename', fileName);

    const stream = fs.createReadStream(`pdf/${fileName}`);
    stream.pipe(res);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @UseGuards(ThrottlerGuard)
  @Post('accountPaymentReport')
  async getAccountPaymentReport(
    @Body() payload: ReportDto,
    @Res() res: Response,
  ) {
    const fileName = 'accountPaymentReport.pdf';
    await this.pdfReportsService.getAccountPaymentReport(payload, fileName);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment');
    res.setHeader('filename', 'invoice.pdf');

    const stream = fs.createReadStream(`pdf/${fileName}`);
    stream.pipe(res);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @UseGuards(ThrottlerGuard)
  @Post('paymentReport')
  async getPaymentReport(
    @Body() payload: PaymentReportDto,
    @Res() res: Response,
  ) {
    const fileName = 'paymentReport.pdf';
    await this.pdfReportsService.getPaymentReport(payload, fileName);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment');
    res.setHeader('filename', 'invoice.pdf');

    const stream = fs.createReadStream(`pdf/${fileName}`);
    stream.pipe(res);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @UseGuards(ThrottlerGuard)
  @Post('retentionReport')
  async getRetentionReport(@Body() payload: ReportDto, @Res() res: Response) {
    const fileName = 'retentionReport.pdf';
    await this.pdfReportsService.getRetentionsReport(payload, fileName);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment');
    res.setHeader('filename', 'invoice.pdf');

    const stream = fs.createReadStream(`pdf/${fileName}`);
    stream.pipe(res);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @UseGuards(ThrottlerGuard)
  @Post('referenceInvoiceReport')
  async getReferenceInvoiceReport(
    @Body() payload: ReferenceDto,
    @Res() res: Response,
  ) {
    const fileName = 'referenceInvoiceReport.pdf';
    await this.pdfReportsService.getReferenceInvoiceReport(payload, fileName);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment');
    res.setHeader('filename', 'invoice.pdf');

    const stream = fs.createReadStream(`pdf/${fileName}`);
    stream.pipe(res);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @UseGuards(ThrottlerGuard)
  @Post('referencePaymentReport')
  async getReferencePaymentReport(
    @Body() payload: ReferenceDto,
    @Res() res: Response,
  ) {
    const fileName = 'referencePaymentReport.pdf';
    await this.pdfReportsService.getReferencePaymentReport(payload, fileName);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment');
    res.setHeader('filename', 'invoice.pdf');

    const stream = fs.createReadStream(`pdf/${fileName}`);
    stream.pipe(res);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @UseGuards(ThrottlerGuard)
  @Post('igtfBook')
  async getIgtfBookReport(@Body() payload: ReportDto, @Res() res: Response) {
    const fileName = 'igtfBook.pdf';
    await this.pdfReportsService.getIgtfReport(payload, fileName);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment');
    res.setHeader('filename', 'invoice.pdf');

    const stream = fs.createReadStream(`pdf/${fileName}`);
    stream.pipe(res);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @UseGuards(ThrottlerGuard)
  @Post('paidInvoiceReport')
  async getPaidInvoiceReport(@Res() res: Response) {
    const fileName = 'paidInvoiceReport.pdf';
    await this.pdfReportsService.getNotPaidInvoiceReport(fileName);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment');
    res.setHeader('filename', 'invoice.pdf');

    const stream = fs.createReadStream(`pdf/${fileName}`);
    stream.pipe(res);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @UseGuards(ThrottlerGuard)
  @Post('conciliationInvoice')
  async getConciliationReport(
    @Body() payload: SalesBookReportDto,
    @Res() res: Response,
  ) {
    const fileName = 'conciliationInvoice.pdf';
    await this.pdfReportsService.getConciliationInvoiceReport(
      payload,
      fileName,
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment');
    res.setHeader('filename', 'invoice.pdf');

    const stream = fs.createReadStream(`pdf/${fileName}`);
    stream.pipe(res);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @UseGuards(ThrottlerGuard)
  @Post('portalPaymentReport')
  async getPortalPaymentReport(
    @Body() payload: PortalReportDto,
    @Res() res: Response,
  ) {
    const fileName = 'portalPaymentReport.pdf';
    await this.pdfReportsService.getPortalPaymentReport(payload, fileName);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment');
    res.setHeader('filename', 'invoice.pdf');

    const stream = fs.createReadStream(`pdf/${fileName}`);
    stream.pipe(res);
  }
}
