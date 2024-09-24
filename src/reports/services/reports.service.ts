import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Raw, Repository } from 'typeorm';

import {
  ReportDto,
  PaymentReportDto,
  SalesBookReportDto,
  ReferenceDto,
  PortalReportDto,
} from '../dtos/reports.dtos';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { PaymentMethod } from 'src/payment-methods/entities/payment-method.entity';
import {
  Account,
  Igtf,
  Summary,
  SummaryIgtfBook,
  SummaryPaidInvoice,
  SummaryReference,
  SummaryRetentions,
  SummarySalesBook,
} from '../models/reports.model';
import { firstValueFrom, map } from 'rxjs';
import config from '../../config';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import * as https from 'https';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepo: Repository<Invoice>,
    @InjectRepository(PaymentMethod)
    private paymentMethodRepo: Repository<PaymentMethod>,
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
    private readonly httpService: HttpService,
  ) {}

  async getSalesBookReport(params: SalesBookReportDto) {
    params.since.setUTCMinutes(params.since.getTimezoneOffset());
    params.until.setUTCMinutes(params.until.getTimezoneOffset());
    params.until.setDate(params.until.getDate() + 1);

    const report: Invoice[] = await this.invoiceRepo.query(
      `SELECT * FROM get_sales_book_report($1, $2, $3, $4, $5, $6)`,
      [
        params.since.toLocaleDateString('en-US'),
        params.until.toLocaleDateString('en-US'),
        params.paymentMethod,
        params.organizationId,
        params.clientType,
        params.currencyReport,
      ],
    );

    const summary: SummarySalesBook = await this.invoiceRepo.query(
      `SELECT * FROM public.get_sales_book_summary($1, $2, $3, $4, $5, $6);`,
      [
        params.since.toLocaleDateString('en-US'),
        params.until.toLocaleDateString('en-US'),
        params.paymentMethod,
        params.organizationId,
        params.clientType,
        params.currencyReport,
      ],
    );

    return {
      report,
      summary: summary[0],
    };
  }

  async getAccountReport(params: ReportDto) {
    params.since.setUTCMinutes(params.since.getTimezoneOffset());
    params.until.setUTCMinutes(params.until.getTimezoneOffset());
    params.until.setDate(params.until.getDate() + 1);

    const report: Account[] = await this.paymentMethodRepo.query(
      `SELECT * FROM public.get_payment_method_invoice_report($1, $2);`,
      [
        params.since.toLocaleDateString('en-US'),
        params.until.toLocaleDateString('en-US'),
      ],
    );
    const summary: Summary = await this.paymentMethodRepo.query(
      `SELECT * FROM public.get_payment_method_invoice_summary($1, $2);`,
      [
        params.since.toLocaleDateString('en-US'),
        params.until.toLocaleDateString('en-US'),
      ],
    );
    return {
      report: report,
      summary: summary[0],
    };
  }

  async getCanceledInvoiceReport(params: ReportDto) {
    params.since.setUTCMinutes(params.since.getTimezoneOffset());
    params.until.setUTCMinutes(params.until.getTimezoneOffset());
    params.until.setDate(params.until.getDate() + 1);

    const report: Invoice[] = await this.invoiceRepo.find({
      where: [
        {
          registerDate: Raw(
            (registerDate) =>
              `${registerDate} >= :since AND ${registerDate} <= :until`,
            {
              since: `${params.since.toLocaleDateString('en-US')}`,
              until: `${params.until.toLocaleDateString('en-US')}`,
            },
          ),
          canceled: true,
        },
      ],
      relations: {
        paymentMethod: true,
      },
      order: {
        id: 'DESC',
      },
    });

    return report;
  }

  async getAccountPaymentReport(params: ReportDto) {
    params.since.setUTCMinutes(params.since.getTimezoneOffset());
    params.until.setUTCMinutes(params.until.getTimezoneOffset());
    params.until.setDate(params.until.getDate() + 1);

    const report: Account[] = await this.paymentMethodRepo.query(
      `SELECT * FROM public.get_payment_method_payments_report($1, $2);`,
      [
        params.since.toLocaleDateString('en-US'),
        params.until.toLocaleDateString('en-US'),
      ],
    );
    const summary: Summary = await this.paymentMethodRepo.query(
      `SELECT * FROM public.get_payment_method_payments_summary($1, $2);`,
      [
        params.since.toLocaleDateString('en-US'),
        params.until.toLocaleDateString('en-US'),
      ],
    );
    return {
      report: report,
      summary: summary[0],
    };
  }

  async getPaymentReport(params: PaymentReportDto) {
    params.since.setUTCMinutes(params.since.getTimezoneOffset());
    params.until.setUTCMinutes(params.until.getTimezoneOffset());
    params.until.setDate(params.until.getDate() + 1);

    const report: Payment[] = await this.paymentRepo
      .createQueryBuilder('payments')
      .leftJoinAndSelect('payments.paymentMethod', 'payment_method')
      .where('payments.register_date >= :since', { since: params.since })
      .andWhere('payments.register_date <= :until', { until: params.until })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            'payments.payment_method_id = :paymentMethod AND :paymentMethod != 0',
            {
              paymentMethod: params.paymentMethod,
            },
          ).orWhere(':paymentMethod = 0', {
            paymentMethod: params.paymentMethod,
          });
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            `payments.currency_code = :currencyCode AND :currencyCode != 'ALL'`,
            {
              currencyCode: params.currencyCode,
            },
          ).orWhere(`:currencyCode = 'ALL'`, {
            currencyCode: params.currencyCode,
          });
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            'payments.organization_id = :organizationId AND :organizationId != 0',
            {
              organizationId: params.organizationId,
            },
          ).orWhere(':organizationId = 0', {
            organizationId: params.organizationId,
          });
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where('payments.client_type = :clientType AND :clientType != 0', {
            clientType: params.clientType,
          }).orWhere(':clientType = 0', {
            clientType: params.clientType,
          });
        }),
      )
      .orderBy('register_date', 'ASC')
      .getMany();

    const summary = await this.paymentRepo.query(
      `SELECT * FROM public.get_payment_summary($1, $2, $3, $4, $5, $6)`,
      [
        params.since.toLocaleDateString('en-US'),
        params.until.toLocaleDateString('en-US'),
        params.currencyCode,
        params.paymentMethod,
        params.organizationId,
        params.clientType,
      ],
    );

    return [report, summary[0]];
  }

  async getRetentionsReport(params: ReportDto) {
    params.since.setUTCMinutes(params.since.getTimezoneOffset());
    params.until.setUTCMinutes(params.until.getTimezoneOffset());
    params.until.setDate(params.until.getDate() + 1);

    const report: Invoice[] = await this.invoiceRepo.find({
      where: [
        {
          registerDate: Raw(
            (registerDate) =>
              `${registerDate} >= :since AND ${registerDate} <= :until`,
            {
              since: `${params.since.toLocaleDateString('en-US')}`,
              until: `${params.until.toLocaleDateString('en-US')}`,
            },
          ),
          iva_r: Raw((iva_r) => `${iva_r} != 0`),
        },
        {
          registerDate: Raw(
            (registerDate) =>
              `${registerDate} >= :since AND ${registerDate} <= :until`,
            {
              since: `${params.since.toLocaleDateString('en-US')}`,
              until: `${params.until.toLocaleDateString('en-US')}`,
            },
          ),
          islr: Raw((islr) => `${islr} != 0`),
        },
      ],
      order: {
        invoiceNumber: 'ASC',
      },
    });

    const summary: SummaryRetentions = await this.invoiceRepo.query(
      `SELECT * FROM public.get_retention_summary($1, $2)`,
      [
        params.since.toLocaleDateString('en-US'),
        params.until.toLocaleDateString('en-US'),
      ],
    );

    return {
      report,
      summary: summary[0],
    };
  }

  async getReferenceInvoiceReport(params: ReferenceDto) {
    params.since.setUTCMinutes(params.since.getTimezoneOffset());
    params.until.setUTCMinutes(params.until.getTimezoneOffset());
    params.until.setDate(params.until.getDate() + 1);

    const report: Invoice[] = await this.invoiceRepo.find({
      where: {
        registerDate: Raw(
          (registerDate) =>
            `${registerDate} >= :since AND ${registerDate} <= :until`,
          {
            since: `${params.since.toLocaleDateString('en-US')}`,
            until: `${params.until.toLocaleDateString('en-US')}`,
          },
        ),
        paymentMethodId: params.paymentMethod,
        type: 'FACT',
      },
      order: {
        invoiceNumber: 'ASC',
      },
      relations: {
        paymentMethod: true,
        user: {
          employee: true,
        },
      },
    });

    const summary: SummaryReference = await this.invoiceRepo.query(
      `SELECT * FROM public.get_reference_invoice_summary($1, $2, $3)`,
      [
        params.since.toLocaleDateString('en-US'),
        params.until.toLocaleDateString('en-US'),
        params.paymentMethod,
      ],
    );

    return {
      report,
      summary: summary[0],
    };
  }

  async getReferencePaymentReport(params: ReferenceDto) {
    params.since.setUTCMinutes(params.since.getTimezoneOffset());
    params.until.setUTCMinutes(params.until.getTimezoneOffset());
    params.until.setDate(params.until.getDate() + 1);

    const report: Payment[] = await this.paymentRepo.find({
      where: {
        registerDate: Raw(
          (registerDate) =>
            `${registerDate} >= :since AND ${registerDate} <= :until`,
          {
            since: `${params.since.toLocaleDateString('en-US')}`,
            until: `${params.until.toLocaleDateString('en-US')}`,
          },
        ),
        paymentMethodId: params.paymentMethod,
      },
      order: {
        id: 'ASC',
      },
      relations: {
        paymentMethod: true,
        user: {
          employee: true,
        },
      },
    });

    const summary: SummaryReference = await this.invoiceRepo.query(
      `SELECT * FROM public.get_reference_payment_summary($1, $2, $3)`,
      [
        params.since.toLocaleDateString('en-US'),
        params.until.toLocaleDateString('en-US'),
        params.paymentMethod,
      ],
    );

    return {
      report,
      summary: summary[0],
    };
  }

  async getIgtfBookReport(params: ReportDto) {
    params.since.setUTCMinutes(params.since.getTimezoneOffset());
    params.until.setUTCMinutes(params.until.getTimezoneOffset());
    params.until.setDate(params.until.getDate() + 1);

    const report: Igtf[] = await this.invoiceRepo.query(
      `SELECT * FROM public.get_invoices_with_igtf_report($1, $2)`,
      [
        params.since.toLocaleDateString('en-US'),
        params.until.toLocaleDateString('en-US'),
      ],
    );

    const summary: SummaryIgtfBook = await this.invoiceRepo.query(
      `SELECT * FROM public.get_invoices_with_igtf_summary($1, $2)`,
      [
        params.since.toLocaleDateString('en-US'),
        params.until.toLocaleDateString('en-US'),
      ],
    );

    return {
      report,
      summary: summary[0],
    };
  }

  async getPaidInvoiceReport() {
    const report: Invoice[] = await this.invoiceRepo.find({
      where: {
        paid: false,
        canceled: false,
        type: 'FACT',
      },
      relations: {
        paymentMethod: true,
      },
      order: {
        invoiceNumber: 'ASC',
      },
    });

    const summary: SummaryPaidInvoice[] = await this.invoiceRepo.query(
      `SELECT * FROM public.get_unpaid_invoices_summary()`,
    );

    return {
      report,
      summary: summary[0],
    };
  }

  async getConciliationReport(params: SalesBookReportDto) {
    params.since.setUTCMinutes(params.since.getTimezoneOffset());
    params.until.setUTCMinutes(params.until.getTimezoneOffset());

    const report: Invoice[] = await this.invoiceRepo
      .createQueryBuilder('invoices')
      .where('invoices.payment_date >= :since', { since: params.since })
      .andWhere('invoices.payment_date <= :until', { until: params.until })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            'invoices.payment_method_id = :paymentMethod AND :paymentMethod != 0',
            {
              paymentMethod: params.paymentMethod,
            },
          ).orWhere(':paymentMethod = 0', {
            paymentMethod: params.paymentMethod,
          });
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            'invoices.organization_id = :organizationId AND :organizationId != 0',
            {
              organizationId: params.organizationId,
            },
          ).orWhere(':organizationId = 0', {
            organizationId: params.organizationId,
          });
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where('invoices.client_type = :clientType AND :clientType != 0', {
            clientType: params.clientType,
          }).orWhere(':clientType = 0', {
            clientType: params.clientType,
          });
        }),
      )
      .orderBy('invoice_number', 'ASC')
      .getMany();

    const summary: SummarySalesBook = await this.invoiceRepo.query(
      `SELECT * FROM public.get_conciliation_summary($1, $2, $3, $4, $5);`,
      [
        params.since.toLocaleDateString('en-US'),
        params.until.toLocaleDateString('en-US'),
        params.paymentMethod,
        params.organizationId,
        params.clientType,
      ],
    );

    return {
      report,
      summary: summary[0],
    };
  }

  async getPortalPaymentReport(params: PortalReportDto) {
    const url = new URL(`payments/report`, this.configService.portalUrl);
    const headers = { Auth: this.configService.apiKeyPortal };
    const axiosConfig = {
      headers,
    };
    return this.httpService
      .post(url.toString(), params, axiosConfig)
      .pipe(map((res) => res.data));
  }

  async getPortalPaymentMethods() {
    const url = new URL(`payment-methods`, this.configService.portalUrl);
    const headers = { Auth: this.configService.apiKeyPortal };
    const axiosConfig = {
      headers,
    };
    return this.httpService
      .get(url.toString(), axiosConfig)
      .pipe(map((res) => res.data));
  }

  async getBdvPaymentDetails(id: string) {
    const url = new URL(`bdv?id=${id}`, this.configService.portalUrl);
    const headers = { Auth: this.configService.apiKeyPortal };
    const axiosConfig = {
      headers,
    };
    return this.httpService
      .get(url.toString(), axiosConfig)
      .pipe(map((res) => res.data));
  }

  async getOrganization(organizationId: number) {
    const url = `${this.configService.crmUrl}/organizations/${organizationId}`;

    const headers = {
      'X-Auth-App-Key': `${this.configService.crmApikey}`,
    };

    const axiosConfig = {
      headers,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    };

    const response = await firstValueFrom(
      this.httpService.get(url, axiosConfig),
    );

    return response.data;
  }
}
