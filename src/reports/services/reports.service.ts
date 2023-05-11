import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';

import { ReportDto } from '../dtos/reports.dtos';
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

  async getBookReports(params: ReportDto) {
    return this.invoiceRepo.find({
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
  }

  async getInvoiceReports(params: ReportDto) {
    let listPayments = await this.paymentRepo.find({
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
        registerDate: 'ASC',
      },
      relations: {
        paymentMethod: true,
        user: true
      }
    });

    let totalAmount = listPayments
    .reduce((total, item) => {
      return total + item.amount;
    }, 0);

    return [
      listPayments,
      totalAmount
    ]
  }

  async getPaymentReport(params: ReportDto) {
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
