import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Raw, Repository } from 'typeorm';

import {
  ReportDto,
  PaymentReportDto,
  SalesBookReportDto,
  ReferenceDto,
} from '../dtos/reports.dtos';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { PaymentMethod } from 'src/payment-methods/entities/payment-method.entity';
import {
  Account,
  Igtf,
  Summary,
  SummaryIgtfBook,
  SummaryReference,
  SummaryRetentions,
  SummarySalesBook,
} from '../models/reports.model';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepo: Repository<Invoice>,
    @InjectRepository(PaymentMethod)
    private paymentMethodRepo: Repository<PaymentMethod>,
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
  ) {}

  async getSalesBookReport(params: SalesBookReportDto) {
    const report: Invoice[] = await this.invoiceRepo
      .createQueryBuilder('invoices')
      .where('invoices.register_date >= :since', { since: params.since })
      .andWhere('invoices.register_date <= :until', { until: params.until })
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
      .getMany();

    const summary: SummarySalesBook = await this.invoiceRepo.query(`
        SELECT
        COALESCE(SUM(CAST(
              CASE
                  WHEN invoices.currency_code != 'BS'
                    THEN invoices.subtotal*invoices.exhange_rate
                  ELSE invoices.subtotal
              END AS float
              )), 0) AS total_subtotal,
        COALESCE(SUM(CAST(
              CASE
                  WHEN invoices.currency_code != 'BS'
                    THEN invoices.iva*invoices.exhange_rate
                  ELSE invoices.iva
              END AS float
              )), 0) AS total_iva,
        COALESCE(SUM(CAST(
                  CASE
                      WHEN invoices.currency_code != 'BS'
                        THEN invoices.iva_r*invoices.exhange_rate
                      ELSE invoices.iva_r
                  END AS float
                  )), 0) AS total_iva_r,
        COALESCE(SUM(CAST(
                  CASE
                      WHEN invoices.currency_code != 'BS'
                        THEN invoices.iva_p*invoices.exhange_rate
                      ELSE invoices.iva_p
                  END AS float
                  )), 0) AS total_iva_p,
        COALESCE(SUM(CAST(
                  CASE
                      WHEN invoices.currency_code != 'BS'
                        THEN invoices.igtf*invoices.exhange_rate
                      ELSE invoices.igtf
                  END AS float
                  )), 0) AS total_igtf,
        COALESCE(SUM(CAST(
                  CASE
                      WHEN invoices.currency_code != 'BS'
                        THEN invoices.islr*invoices.exhange_rate
                      ELSE invoices.islr
                  END AS float
                  )), 0) AS total_islr,
        COALESCE(SUM(CAST(
                  CASE
                      WHEN invoices.currency_code != 'BS'
                        THEN (invoices.total_amount-invoices.iva_r-invoices.islr)*invoices.exhange_rate
                      ELSE invoices.total_amount-invoices.iva_r-invoices.islr
                  END AS float
                  )), 0) AS total_neto,
        COALESCE(SUM(CAST(
                  CASE
                      WHEN invoices.currency_code != 'BS'
                        THEN invoices.total_amount*invoices.exhange_rate
                      ELSE invoices.total_amount
                  END AS float
                  )), 0) AS total_amount,
        count(CASE invoices.canceled WHEN true  THEN 1 ELSE 1 END) as total_invoices,
        count(CASE invoices.canceled WHEN true THEN 1 END) as total_invoices_canceled
        FROM invoices
        WHERE
          invoices.register_date >= '${params.since.toDateString()}'
          AND invoices.register_date <= '${params.until.toDateString()}'
          AND ((invoices.payment_method_id = '${params.paymentMethod}' AND
              '${params.paymentMethod}' != 0) OR
              ('${params.paymentMethod}' = 0))
          AND ((invoices.organization_id = '${params.organizationId}' AND
              '${params.organizationId}' != 0) OR
              ('${params.organizationId}' = 0))
          AND ((invoices.client_type = '${params.clientType}' AND
              '${params.clientType}' != 0) OR
              ('${params.clientType}' = 0));`);

    return {
      report,
      summary: summary[0],
    };
  }

  async getAccountReport(params: ReportDto) {
    const report: Account[] = await this.paymentMethodRepo.query(
      `SELECT payment_methods.id AS id,
      payment_methods.name AS name,
      COUNT(CASE invoices.canceled WHEN false THEN 1 END)::INT AS payments,
      COALESCE(SUM(CAST(
          CASE
              WHEN invoices.currency_code = 'BS'
                THEN (invoices.total_amount-invoices.iva_r-invoices.islr)/invoices.exhange_rate
              ELSE invoices.total_amount - invoices.iva_r - invoices.islr
          END AS float
          )), 0) AS usd_balance,
      COALESCE(SUM(CAST(
          CASE
              WHEN invoices.currency_code = 'USD'
                THEN (invoices.total_amount - invoices.iva_r - invoices.islr)*invoices.exhange_rate
              ELSE invoices.total_amount - invoices.iva_r - invoices.islr
          END AS float
          )), 0) AS bs_balance
      FROM payment_methods
        LEFT JOIN invoices ON payment_methods.id = invoices.payment_method_id
      WHERE invoices.register_date >= '${params.since.toDateString()}'
        AND invoices.register_date <= '${params.until.toDateString()}'
        AND invoices.canceled = false
      GROUP BY payment_methods.id
      ORDER BY usd_balance DESC, id ASC;`,
    );
    const summary: Summary = await this.paymentMethodRepo
      .query(`SELECT COUNT(CASE invoices.canceled WHEN false THEN 1 END)::INT AS payments,
    COALESCE(SUM(CAST(
        CASE
            WHEN invoices.currency_code = 'BS'
              THEN (invoices.total_amount - invoices.iva_r - invoices.islr)/invoices.exhange_rate
            ELSE invoices.total_amount - invoices.iva_r - invoices.islr
        END AS float
        )), 0) AS total_usd_balance,
    COALESCE(SUM(CAST(
        CASE
            WHEN invoices.currency_code = 'USD'
              THEN (invoices.total_amount - invoices.iva_r - invoices.islr)*invoices.exhange_rate
            ELSE invoices.total_amount - invoices.iva_r - invoices.islr
        END AS float
        )), 0) AS total_bs_balance
    FROM invoices
    WHERE invoices.register_date >= '${params.since.toDateString()}'
      AND invoices.register_date <= '${params.until.toDateString()}'
      AND invoices.canceled = false;
    `);
    return {
      report: report,
      summary: summary[0],
    };
  }

  async getAccountPaymentReport(params: ReportDto) {
    const report: Account[] = await this.paymentMethodRepo.query(
      `SELECT payment_methods.id AS id,
      payment_methods.name AS name,
      COUNT(payments.id)::INT AS payments,
      COALESCE(SUM(CAST(
          CASE
              WHEN payments.currency_code = 'BS'
                THEN amount/payments.exhange_rate
              ELSE amount
          END AS float
          )), 0) AS usd_balance,
      COALESCE(SUM(CAST(
          CASE
              WHEN payments.currency_code = 'USD'
                THEN amount*payments.exhange_rate
              ELSE amount
          END AS float
          )), 0) AS bs_balance
      FROM payment_methods
        LEFT JOIN payments ON payment_methods.id = payments.payment_method_id
      WHERE payments.register_date >= '${params.since.toDateString()}'
        AND payments.register_date <= '${params.until.toDateString()}'
      GROUP BY payment_methods.id
      ORDER BY id ASC;`,
    );
    const summary: Summary = await this.paymentMethodRepo
      .query(`SELECT COUNT(payments.id)::INT AS payments,
    COALESCE(SUM(CAST(
        CASE
            WHEN payments.currency_code = 'BS'
              THEN amount/payments.exhange_rate
            ELSE amount
        END AS float
        )), 0) AS total_usd_balance,
    COALESCE(SUM(CAST(
        CASE
            WHEN payments.currency_code = 'USD'
              THEN amount*payments.exhange_rate
            ELSE amount
        END AS float
        )), 0) AS total_bs_balance
    FROM payments
    WHERE payments.register_date >= '${params.since.toDateString()}'
      AND payments.register_date <= '${params.until.toDateString()}'
    `);
    return {
      report: report,
      summary: summary[0],
    };
  }

  async getPaymentReport(params: PaymentReportDto) {
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
      .getMany();

    const summary = await this.paymentRepo.query(`
        SELECT
        COALESCE(SUM(CAST(
              CASE
                  WHEN payments.currency_code = 'BS'
                    THEN payments.amount / payments.exhange_rate
                  ELSE payments.amount
              END AS float
              )), 0) AS total_usd,
        COALESCE(SUM(CAST(
              CASE
                  WHEN payments.currency_code = 'USD'
                    THEN payments.amount * payments.exhange_rate
                  ELSE payments.amount
              END AS float
              )), 0) AS total_bs
              FROM payments
        WHERE payments.register_date >= '${params.since.toDateString()}'
        AND payments.register_date <= '${params.until.toDateString()}'
        AND ((payments.currency_code = '${params.currencyCode}' AND '${
      params.currencyCode
    }' != 'ALL') OR '${params.currencyCode}' = 'ALL')
        AND ((payments.payment_method_id = '${params.paymentMethod}' AND
          '${params.paymentMethod}' != 0) OR
          ('${params.paymentMethod}' = 0));`);

    return [report, summary[0]];
  }

  async getRetentionsReport(params: ReportDto) {
    const report: Invoice[] = await this.invoiceRepo.find({
      where: [
        {
          registerDate: Raw(
            (registerDate) =>
              `${registerDate} >= :since AND ${registerDate} <= :until`,
            {
              since: `${params.since.toISOString()}`,
              until: `${params.until.toISOString()}`,
            },
          ),
          iva_r: Raw((iva_r) => `${iva_r} != 0`),
        },
        {
          registerDate: Raw(
            (registerDate) =>
              `${registerDate} >= :since AND ${registerDate} <= :until`,
            {
              since: `${params.since.toISOString()}`,
              until: `${params.until.toISOString()}`,
            },
          ),
          islr: Raw((islr) => `${islr} != 0`),
        },
      ],
      order: {
        invoiceNumber: 'ASC',
      },
    });

    const summary: SummaryRetentions = await this.invoiceRepo.query(`
        SELECT
        COALESCE(SUM(CAST(
              CASE
                  WHEN invoices.currency_code != 'BS'
                    THEN invoices.subtotal*invoices.exhange_rate
                  ELSE invoices.subtotal
              END AS float
              )), 0) AS total_subtotal,
        COALESCE(SUM(CAST(
              CASE
                  WHEN invoices.currency_code != 'BS'
                    THEN invoices.iva*invoices.exhange_rate
                  ELSE invoices.iva
              END AS float
              )), 0) AS total_iva,
        COALESCE(SUM(CAST(
                  CASE
                      WHEN invoices.currency_code != 'BS'
                        THEN invoices.iva_r*invoices.exhange_rate
                      ELSE invoices.iva_r
                  END AS float
                  )), 0) AS total_iva_r,
        COALESCE(SUM(CAST(
                  CASE
                      WHEN invoices.currency_code != 'BS'
                        THEN invoices.iva_p*invoices.exhange_rate
                      ELSE invoices.iva_p
                  END AS float
                  )), 0) AS total_iva_p,
        COALESCE(SUM(CAST(
                  CASE
                      WHEN invoices.currency_code != 'BS'
                        THEN invoices.igtf*invoices.exhange_rate
                      ELSE invoices.igtf
                  END AS float
                  )), 0) AS total_igtf,
        COALESCE(SUM(CAST(
                  CASE
                      WHEN invoices.currency_code != 'BS'
                        THEN invoices.islr*invoices.exhange_rate
                      ELSE invoices.islr
                  END AS float
                  )), 0) AS total_islr,
        COALESCE(SUM(CAST(
                  CASE
                      WHEN invoices.currency_code != 'BS'
                        THEN invoices.total_amount*invoices.exhange_rate
                      ELSE invoices.total_amount
                  END AS float
                  )), 0) AS total_amount,
        COALESCE(SUM(CAST(
                  CASE
                      WHEN invoices.currency_code != 'BS'
                        THEN (invoices.total_amount - invoices.iva_r - invoices.islr)*invoices.exhange_rate
                      ELSE invoices.total_amount - invoices.iva_r - invoices.islr
                  END AS float
                  )), 0) AS total_neto,
        count(invoices) as total_invoices,
        count(DISTINCT invoices.type = 'FACT') as total_invoices_canceled
        FROM invoices
        WHERE invoices.register_date >= '${params.since.toDateString()}'
        AND invoices.register_date <= '${params.until.toDateString()}'
        AND (invoices.iva_r != 0 OR invoices.islr != 0);`);

    return {
      report,
      summary: summary[0],
    };
  }

  async getReferenceInvoiceReport(params: ReferenceDto) {
    const report: Invoice[] = await this.invoiceRepo.find({
      where: {
        registerDate: Raw(
          (registerDate) =>
            `${registerDate} >= :since AND ${registerDate} <= :until`,
          {
            since: `${params.since.toISOString()}`,
            until: `${params.until.toISOString()}`,
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
      },
    });

    const summary: SummaryReference = await this.invoiceRepo.query(`
      SELECT
      COALESCE(SUM(CAST(
                CASE
                    WHEN invoices.currency_code != 'BS'
                      THEN invoices.total_amount
                    ELSE invoices.total_amount/invoices.exhange_rate
                END AS float
                )), 0) AS total_amount_usd,
      COALESCE(SUM(CAST(
                CASE
                    WHEN invoices.currency_code = 'BS'
                      THEN invoices.total_amount
                    ELSE invoices.total_amount*invoices.exhange_rate
                END AS float
                )), 0) AS total_amount_bs,
      count(invoices) as total_references
      FROM invoices
      WHERE invoices.register_date >= '${params.since.toDateString()}'
      AND invoices.register_date <= '${params.until.toDateString()}'
      AND invoices.payment_method_id = '${params.paymentMethod}'`);

    return {
      report,
      summary: summary[0],
    };
  }

  async getReferencePaymentReport(params: ReferenceDto) {
    const report: Payment[] = await this.paymentRepo.find({
      where: {
        registerDate: Raw(
          (registerDate) =>
            `${registerDate} >= :since AND ${registerDate} <= :until`,
          {
            since: `${params.since.toISOString()}`,
            until: `${params.until.toISOString()}`,
          },
        ),
        paymentMethodId: params.paymentMethod,
      },
      order: {
        id: 'ASC',
      },
      relations: {
        paymentMethod: true,
      },
    });

    const summary: SummaryReference = await this.paymentRepo.query(`
      SELECT
        COALESCE(SUM(CAST(
          CASE
              WHEN payments.currency_code != 'BS'
                THEN payments.amount
              ELSE payments.amount/payments.exhange_rate
          END AS float
          )), 0) AS total_amount_usd,
        COALESCE(SUM(CAST(
          CASE
              WHEN payments.currency_code = 'BS'
                THEN payments.amount
              ELSE payments.amount*payments.exhange_rate
          END AS float
          )), 0) AS total_amount_bs,
      count(payments) as total_references
      FROM payments
      WHERE payments.register_date >= '${params.since.toDateString()}'
      AND payments.register_date <= '${params.until.toDateString()}'
      AND payments.payment_method_id = '${params.paymentMethod}'`);

    return {
      report,
      summary: summary[0],
    };
  }

  async getIgtfBookReport(params: ReportDto) {
    const report: Igtf[] = await this.invoiceRepo.query(
      `SELECT invoices.id,
      invoices.invoice_number,
      invoices.client_firstname,
      invoices.client_lastname,
      invoices.client_company_name,
      invoices.register_date,
      COALESCE(CAST(
        CASE
            WHEN invoices.currency_code != 'BS'
              THEN invoices.igtf * invoices.exhange_rate
            ELSE invoices.igtf
        END AS numeric
        ), 0) AS igtf,
      invoices.exhange_rate,
      invoices.currency_code,
      payment_methods.name AS payment_method_name,
      COALESCE(CAST(
        CASE
            WHEN invoices.currency_code != 'BS'
              THEN (invoices.subtotal + invoices.iva_p - invoices.islr)*invoices.exhange_rate
            ELSE invoices.subtotal + invoices.iva_p - invoices.islr
        END AS numeric
        ), 0) AS imponible
      FROM invoices
      INNER JOIN payment_methods ON invoices.payment_method_id = payment_methods.id
      WHERE invoices.register_date >= '${params.since.toDateString()}'
      AND invoices.register_date <= '${params.until.toDateString()}'
      AND invoices.igtf != 0
      ORDER BY invoices.id;`,
    );

    const summary: SummaryIgtfBook = await this.invoiceRepo.query(
      `SELECT
      COALESCE(SUM(CAST(
                CASE
                    WHEN invoices.currency_code != 'BS'
                      THEN invoices.igtf*invoices.exhange_rate
                    ELSE invoices.igtf
                END AS numeric
                )), 0) AS total_igtf,
      COALESCE(SUM(CAST(
                CASE
                    WHEN invoices.currency_code != 'BS'
                      THEN (invoices.subtotal + invoices.iva_p - invoices.islr)*invoices.exhange_rate
                    ELSE invoices.subtotal + invoices.iva_p - invoices.islr
                END AS numeric
                )), 0) AS total_imponible,
      COUNT(CASE invoices.canceled WHEN false THEN 1 END)::INT as total_invoices
      FROM invoices
      WHERE invoices.register_date >= '${params.since.toDateString()}'
      AND invoices.register_date <= '${params.until.toDateString()}'
      AND invoices.igtf != 0;`,
    );

    return {
      report,
      summary: summary[0],
    };
  }
}
