import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import {
  PaymentReportDto,
  ReferenceDto,
  ReportDto,
  SalesBookReportDto,
} from '../dtos/reports.dtos';
import { ReportsService } from '../services/reports.service';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/roles.model';

@UseGuards(ApiKeyGuard, JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('salesBook')
  async getSalesBookReport(@Body() payload: SalesBookReportDto) {
    return await this.reportsService.getSalesBookReport(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('accountReport')
  async getAllAccount(@Body() payload: ReportDto) {
    return await this.reportsService.getAccountReport(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('accountPaymentReport')
  async getAccountPaymentReport(@Body() payload: ReportDto) {
    return await this.reportsService.getAccountPaymentReport(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('paymentReport')
  async getPaymentReport(@Body() payload: PaymentReportDto) {
    return await this.reportsService.getPaymentReport(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('retentionsReport')
  async getRetentionsReport(@Body() payload: ReportDto) {
    return await this.reportsService.getRetentionsReport(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('referenceInvoiceReport')
  async getReferencePaymentReport(@Body() payload: ReferenceDto) {
    return await this.reportsService.getReferenceInvoiceReport(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('referencePaymentReport')
  async getReferenceInvoiceReport(@Body() payload: ReferenceDto) {
    return await this.reportsService.getReferencePaymentReport(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('igtfBook')
  async getIgtfBookReport(@Body() payload: ReportDto) {
    return await this.reportsService.getIgtfBookReport(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Get('paidInvoiceReport')
  async getPaidInvoiceReport() {
    return await this.reportsService.getPaidInvoiceReport();
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Post('conciliationInvoice')
  async getConciliationInvoice(@Body() payload: SalesBookReportDto) {
    return await this.reportsService.getConciliationReport(payload);
  }
}
