import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';

import { Invoice } from 'src/invoices/entities/invoice.entity';
import { PaymentMethod } from 'src/payment-methods/entities/payment-method.entity';
import { SalesBookDto } from '../dtos/salesBook.dtos';
import { ReportDto } from '../dtos/reports.dtos';

@Injectable()
export class ReportsLogicService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepo: Repository<Invoice>,
    @InjectRepository(PaymentMethod)
    private paymentMethodRepo: Repository<PaymentMethod>,
  ) {}

  generateSalesBook(params: SalesBookDto) {
    return this.invoiceRepo.find({
      where: {
        registerDate: Raw(
          (registerDate) => `${registerDate} >= :since AND ${registerDate} <= :until`,
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

  paymentMethodReport(params: ReportDto) {
    return this.paymentMethodRepo.query(
      `SELECT payment_methods.id AS id,
      payment_methods.name AS name,
      COUNT(invoices)::INT AS payments,
      COALESCE(SUM(CAST(
          CASE
              WHEN invoices.usd_invoice = false
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
