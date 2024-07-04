import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { CsvReportsService } from '../services/csv-reports.service';
import {
  PaymentReportDto,
  PortalReportDto,
  ReferenceDto,
  ReportDto,
  SalesBookReportDto,
} from '../dtos/reports.dtos';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';

@UseGuards(ApiKeyGuard, JwtAuthGuard, RolesGuard)
@Controller('csv-reports')
export class CsvReportsController {
  constructor(private csvReportService: CsvReportsService) {}

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @Post('salesBook')
  async getSalesBookReport(
    @Body() payload: SalesBookReportDto,
    @Res() res: Response,
  ) {
    const csvData = await this.csvReportService.getSalesBookReport(payload);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="libro_ventas.csv"`,
    );
    res.status(200).send(csvData);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @Post('accountReport')
  async getAccountReport(@Body() payload: ReportDto, @Res() res: Response) {
    const csvData = await this.csvReportService.getAccountReport(payload);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="reporte_de_cuentas_facturas.csv"`,
    );
    res.status(200).send(csvData);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @Post('accountPaymentReport')
  async getAccountPaymentReport(
    @Body() payload: ReportDto,
    @Res() res: Response,
  ) {
    const csvData =
      await this.csvReportService.getAccountPaymentReport(payload);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="reporte_de_cuentas_pagos.csv"`,
    );
    res.status(200).send(csvData);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @Post('paymentReport')
  async getPaymentReport(
    @Body() payload: PaymentReportDto,
    @Res() res: Response,
  ) {
    const csvData = await this.csvReportService.getPaymentReport(payload);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="reporte_de_pagos.csv"`,
    );
    res.status(200).send(csvData);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @Post('retentionReport')
  async getRetentionReport(@Body() payload: ReportDto, @Res() res: Response) {
    const csvData = await this.csvReportService.getRetentionReport(payload);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="reporte_de_retenciones.csv"`,
    );
    res.status(200).send(csvData);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @Post('referenceInvoiceReport')
  async getReferenceInvoiceReport(
    @Body() payload: ReferenceDto,
    @Res() res: Response,
  ) {
    const csvData =
      await this.csvReportService.getReferenceInvoiceReport(payload);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="reporte_de_referencias_facturas.csv"`,
    );
    res.status(200).send(csvData);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @Post('referencePaymentReport')
  async getReferencePaymentReport(
    @Body() payload: ReferenceDto,
    @Res() res: Response,
  ) {
    const csvData =
      await this.csvReportService.getReferencePaymentReport(payload);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="reporte_de_referencias_pagos.csv"`,
    );
    res.status(200).send(csvData);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @Post('igtfBook')
  async getIgtfBookReport(@Body() payload: ReportDto, @Res() res: Response) {
    const csvData = await this.csvReportService.getIgtfBookReport(payload);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="libro_igtf.csv"`,
    );
    res.status(200).send(csvData);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @Get('paidInvoiceReport')
  async getPaidInvoiceReport(@Res() res: Response) {
    const csvData = await this.csvReportService.getPaidInvoiceReport();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="facturas_no_pagadas.csv"`,
    );
    res.status(200).send(csvData);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @Post('conciliationInvoice')
  async getConciliationReport(
    @Body() payload: SalesBookReportDto,
    @Res() res: Response,
  ) {
    const csvData = await this.csvReportService.getConciliationReport(payload);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="conciliacion_facturas.csv"`,
    );
    res.status(200).send(csvData);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @Post('portalPaymentReport')
  async getPortalPaymentReport(
    @Body() payload: PortalReportDto,
    @Res() res: Response,
  ) {
    const csvData = await this.csvReportService.getPortalPaymentReport(payload);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="reporte_portal.csv"`,
    );
    res.status(200).send(csvData);
  }
}
