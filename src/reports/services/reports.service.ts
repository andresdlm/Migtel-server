import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';

import { ReportDto, PaymentReportDto } from '../dtos/reports.dtos';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { PaymentMethod } from 'src/payment-methods/entities/payment-method.entity';

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

  async getSalesBookReport(params: ReportDto) {
    const listReports = await this.invoiceRepo.find({
      where: {
        registerDate: Raw(
          (registerDate) =>
            `${registerDate} >= :since AND ${registerDate} <= :until`,
          {
            since: `${params.since.toISOString()}`,
            until: `${params.until.toISOString()}`,
          },
        ),
      },
      order: {
        invoiceNumber: 'ASC',
      },
    });

    const summary = await this.invoiceRepo.query(`
    SELECT
    COALESCE(SUM(CAST(
          CASE
              WHEN invoices.currency_code != 'BS'
                THEN invoices.subtotal*invoices.exhange_rate
              ELSE invoices.subtotal
          END AS real
          )), 0) AS total_subtotal,
    COALESCE(SUM(CAST(
          CASE
              WHEN invoices.currency_code != 'BS'
                THEN invoices.iva*invoices.exhange_rate
              ELSE invoices.iva
          END AS real
          )), 0) AS total_iva,
    COALESCE(SUM(CAST(
              CASE
                  WHEN invoices.currency_code != 'BS'
                    THEN invoices.iva_r*invoices.exhange_rate
                  ELSE invoices.iva_r
              END AS real
              )), 0) AS total_iva_r,
    COALESCE(SUM(CAST(
              CASE
                  WHEN invoices.currency_code != 'BS'
                    THEN invoices.iva_p*invoices.exhange_rate
                  ELSE invoices.iva_p
              END AS real
              )), 0) AS total_iva_p,
    COALESCE(SUM(CAST(
              CASE
                  WHEN invoices.currency_code != 'BS'
                    THEN invoices.igtf*invoices.exhange_rate
                  ELSE invoices.igtf
              END AS real
              )), 0) AS total_igtf,
    COALESCE(SUM(CAST(
              CASE
                  WHEN invoices.currency_code != 'BS'
                    THEN invoices.islr*invoices.exhange_rate
                  ELSE invoices.islr
              END AS real
              )), 0) AS total_islr,
    COALESCE(SUM(CAST(
              CASE
                  WHEN invoices.currency_code != 'BS'
                    THEN invoices.total_amount*invoices.exhange_rate
                  ELSE invoices.total_amount
              END AS real
              )), 0) AS total_amount,
    count(invoices) as totalInvoices,
    count(DISTINCT invoices.type = 'FACT') as total_invoices_canceled
    FROM invoices
    WHERE invoices.register_date >= '${params.since.toDateString()}'
    AND invoices.register_date <= '${params.until.toDateString()}';`);
    return [listReports, summary];
  }

  async getPaymentReport(params: PaymentReportDto) {
    const listPayments = await this.paymentRepo.find({
      where: {
        registerDate: Raw(
          (registerDate) =>
            `${registerDate} >= :since AND ${registerDate} <= :until`,
          {
            since: `${params.since.toISOString()}`,
            until: `${params.until.toISOString()}`,
          },
        ),
        currencyCode: params.currencyCode,
        paymentMethodId: params.paymentMethod
      },
      order: {
        registerDate: 'ASC',
      },
      relations: {
        paymentMethod: true,
        user: true,
      },
    });

    const totalAmount = listPayments.reduce((total, item) => {
      return total + item.amount;
    }, 0);

    return [listPayments, totalAmount];
  }

  async getAccountReport(params: ReportDto) {
    return this.paymentMethodRepo.query(
      `SELECT payment_methods.id AS id,
      payment_methods.name AS name,
      COUNT(invoices)::INT AS payments,
      COALESCE(SUM(CAST(
          CASE
              WHEN invoices.currency_code = 'BS'
                THEN invoices.total_amount/invoices.exhange_rate
              ELSE invoices.total_amount
          END AS real
          )), 0) AS balance
      FROM payment_methods
        LEFT JOIN invoices ON payment_methods.id = invoices.payment_method_id
      WHERE invoices.type = 'FACT'
        AND invoices.canceled = false
        AND invoices.register_date >= '${params.since.toDateString()}'
        AND invoices.register_date <= '${params.until.toDateString()}'
      GROUP BY payment_methods.id
      ORDER BY balance DESC, id ASC;`,
    );
  }
}
