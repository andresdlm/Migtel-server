import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Client } from 'src/clients/entities/client.entity';
import { Invoice } from 'src/invoices/entities/invoice.entity';
import { Dashboard } from '../entities/dashboard.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Invoice) private invoiceRepo: Repository<Invoice>,
    @InjectRepository(Client) private clientRepo: Repository<Client>,
  ) {}

  async generateDashboard() {
    const dashboardData: Dashboard = {
      dailyIncome: 0,
      monthIncome: 0,
      taxesGeneratedByMonth: 0,
      yearIncome: [],
      cities: [],
      plans: [],
      accountsBalance: [],
    };

    const dailyIncome = await this.invoiceRepo.query(
      `SELECT COALESCE(SUM(CAST(
        CASE
            WHEN invoices.usd_invoice = false
              THEN invoices.total_amount/invoices.exhange_rate
            ELSE invoices.total_amount
        END AS real
        )), 0) AS dailyIncome
        FROM invoices
        WHERE invoices.type = 'FACT'
          AND invoices.canceled = false
          AND EXTRACT(MONTH FROM invoices.register_date) = EXTRACT(MONTH FROM now())
          AND EXTRACT(DAY FROM invoices.register_date) = EXTRACT(DAY FROM now());`,
    );
    dashboardData.dailyIncome = dailyIncome[0]['dailyincome'];

    const monthIncome = await this.invoiceRepo.query(
      `SELECT COALESCE(SUM(CAST(
        CASE
            WHEN invoices.usd_invoice = false
              THEN invoices.total_amount/invoices.exhange_rate
            ELSE invoices.total_amount
        END AS real
        )), 0) AS monthIncome
        FROM invoices
        WHERE invoices.type = 'FACT'
          AND invoices.canceled = false
          AND EXTRACT(MONTH FROM invoices.register_date) = EXTRACT(MONTH FROM now());`,
    );
    dashboardData.monthIncome = monthIncome[0]['monthincome'];

    const taxesGeneratedByMonth = await this.invoiceRepo.query(
      `SELECT COALESCE(SUM(CAST(
        CASE
            WHEN invoices.usd_invoice = false
              THEN invoices.iva/invoices.exhange_rate
            ELSE invoices.iva
        END AS real
        )), 0) AS taxesGeneratedByMonth
        FROM invoices
        WHERE invoices.type = 'FACT'
          AND invoices.canceled = false
          AND EXTRACT(MONTH FROM invoices.register_date) = EXTRACT(MONTH FROM now());`,
    );
    dashboardData.taxesGeneratedByMonth =
      taxesGeneratedByMonth[0]['taxesgeneratedbymonth'];

    const data = await this.invoiceRepo.query(
      `SELECT date_trunc('month', register_date) AS sale_month,
        COALESCE(SUM(CAST(
        CASE
          WHEN invoices.usd_invoice = false
            THEN invoices.total_amount/invoices.exhange_rate
          ELSE invoices.total_amount
        END AS real
        )), 0) AS month_total
        FROM invoices
        GROUP BY 1
        ORDER BY 1`,
    );

    data.forEach((month) => {
      dashboardData.yearIncome.push(month.month_total);
    });

    dashboardData.cities = await this.clientRepo.query(
      `SELECT clients.city as city, count(clients.id) as clients, SUM(
        CAST(
          CASE
            WHEN invoices.usd_invoice = false
              THEN invoices.total_amount/invoices.exhange_rate
            ELSE invoices.total_amount
            END AS real)) as raised FROM clients
        LEFT JOIN invoices on clients.id = invoices.client_id
        WHERE EXTRACT(MONTH FROM register_date) = EXTRACT(MONTH FROM now())
        GROUP BY clients.city;`,
    );

    dashboardData.plans = await this.invoiceRepo.query(
      `SELECT service_plans.name AS name, COUNT(invoices.id) AS count, SUM(
      CAST(
        CASE
          WHEN invoices.usd_invoice = false
            THEN invoices.total_amount/invoices.exhange_rate
          ELSE invoices.total_amount
          END AS real)) as raised  FROM invoices
        LEFT JOIN invoice_services on invoices.id = invoice_services.invoice_id
        LEFT JOIN client_services on invoice_services.client_service_id = client_services.id
        LEFT JOIN service_plans on client_services.service_plan_id = service_plans.id
      WHERE invoices.type = 'FACT'
      AND invoices.canceled = false
      AND EXTRACT(MONTH FROM invoices.register_date) = EXTRACT(MONTH FROM now())
      GROUP BY service_plans.name
      ORDER BY raised DESC
      LIMIT 7;`,
    );

    dashboardData.accountsBalance = await this.invoiceRepo.query(
      `SELECT payment_methods.id AS id,
        payment_methods.name AS name,
        COUNT(invoices)::INT AS count,
        COALESCE(SUM(CAST(
        CASE
            WHEN invoices.usd_invoice = false
              THEN invoices.total_amount/invoices.exhange_rate
            ELSE invoices.total_amount
        END AS real
        )), 0) AS y
        FROM payment_methods
        LEFT JOIN invoices ON payment_methods.id = invoices.payment_method_id
        WHERE invoices.type = 'FACT'
          AND invoices.canceled = false
          AND EXTRACT(MONTH FROM invoices.register_date) = EXTRACT(MONTH FROM now())
        GROUP BY payment_methods.id
        ORDER BY y DESC, id ASC;`,
    );

    return dashboardData;
  }
}
