import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';

import {
  PaymentReportDto,
  PortalReportDto,
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

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @Post('salesBook')
  async getSalesBookReport(@Body() payload: SalesBookReportDto) {
    return await this.reportsService.getSalesBookReport(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @Post('accountReport')
  async getAllAccount(@Body() payload: ReportDto) {
    return await this.reportsService.getAccountReport(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @Post('accountPaymentReport')
  async getAccountPaymentReport(@Body() payload: ReportDto) {
    return await this.reportsService.getAccountPaymentReport(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @Post('paymentReport')
  async getPaymentReport(@Body() payload: PaymentReportDto) {
    return await this.reportsService.getPaymentReport(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @Post('retentionsReport')
  async getRetentionsReport(@Body() payload: ReportDto) {
    return await this.reportsService.getRetentionsReport(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @Post('referenceInvoiceReport')
  async getReferencePaymentReport(@Body() payload: ReferenceDto) {
    return await this.reportsService.getReferenceInvoiceReport(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @Post('referencePaymentReport')
  async getReferenceInvoiceReport(@Body() payload: ReferenceDto) {
    return await this.reportsService.getReferencePaymentReport(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @Post('igtfBook')
  async getIgtfBookReport(@Body() payload: ReportDto) {
    return await this.reportsService.getIgtfBookReport(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @Get('paidInvoiceReport')
  async getPaidInvoiceReport() {
    return await this.reportsService.getPaidInvoiceReport();
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @Post('conciliationInvoice')
  async getConciliationInvoice(@Body() payload: SalesBookReportDto) {
    return await this.reportsService.getConciliationReport(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @Post('portalPaymentReport')
  async getPortalPaymentReport(@Body() payload: PortalReportDto) {
    return await this.reportsService.getPortalPaymentReport(payload);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @Get('portalPaymentMethods')
  async getPortalPaymentMethods() {
    return await this.reportsService.getPortalPaymentMethods();
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.OPERATOR)
  @Get('bdvPaymentDetails/:id')
  async getBdvPaymentDetails(@Param('id') id: string) {
    return await this.reportsService.getBdvPaymentDetails(id);
  }
}
