import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Invoice } from 'src/invoices/entities/invoice.entity';
import { PaymentMethod } from 'src/payment-methods/entities/payment-method.entity';
import { PaymentMethodsService } from 'src/payment-methods/services/payment-methods.service';
import { Payment } from 'src/payments/entities/payment.entity';
import { CsvReportsController } from './controllers/csv-reports.controller';
import { PdfReportsController } from './controllers/pdf-reports.controller';
import { ReportsController } from './controllers/reports.controller';
import { CsvReportsService } from './services/csv-reports.service';
import * as PdfReport from './services/pdf-reports';
import { PdfReportsService } from './services/pdf-reports.service';
import { ReportsService } from './services/reports.service';
import { PuppeteerUtils } from './utils/puppeteer.utils';
import { ReportsUtilsService } from './utils/reports.utils';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, PaymentMethod, Payment]),
    HttpModule,
    ThrottlerModule.forRoot([
      {
        ttl: 3000,
        limit: 2,
      },
    ]),
  ],
  controllers: [ReportsController, CsvReportsController, PdfReportsController],
  providers: [
    ReportsService,
    CsvReportsService,
    ReportsUtilsService,
    PuppeteerUtils,
    PdfReportsService,
    PaymentMethodsService, // To find all the payment methods in report utils
    PdfReport.SalesBookService,
    PdfReport.AccountService,
    PdfReport.AccountPaymentService,
    PdfReport.PaymentService,
    PdfReport.RetentionsService,
    PdfReport.ReferenceInvoiceService,
    PdfReport.ReferencePaymentService,
    PdfReport.IgtfService,
    PdfReport.NotPaidInvoiceService,
    PdfReport.ConciliationInvoiceService,
    PdfReport.PortalPaymentService,
  ],
})
export class ReportsModule {}
