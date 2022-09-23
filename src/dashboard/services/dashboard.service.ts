import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';

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
    const todayDate = new Date();
    const dashboardData: Dashboard = {
      dailyIncome: 0,
      monthIncome: 0,
      taxesGeneratedByMonth: 0,
      newClientsInMonth: 0,
      yearIncome: [],
      cities: [],
      plans: [],
    };

    const todayInvoices = await this.invoiceRepo.find({
      where: {
        registerDate: Raw((registerDate) => `${registerDate} = :date`, {
          date: `${todayDate.getFullYear()}-${
            todayDate.getMonth() + 1
          }-${todayDate.getUTCDate()}`,
        }),
      },
    });
    todayInvoices.forEach((invoice) => {
      dashboardData.dailyIncome += invoice.totalAmount;
    });

    const monthInvoices = await this.invoiceRepo.find({
      where: {
        registerDate: Raw((registerDate) => `${registerDate} >= :date`, {
          date: `${todayDate.getFullYear()}-${todayDate.getMonth() + 1}-1`,
        }),
      },
    });
    monthInvoices.forEach((invoice) => {
      dashboardData.monthIncome += invoice.totalAmount;
      dashboardData.taxesGeneratedByMonth += invoice.iva;
    });

    dashboardData.newClientsInMonth = await this.clientRepo.count({
      where: {
        createAt: Raw((createAt) => `${createAt} >= :date`, {
          date: `${todayDate.getFullYear()}-${todayDate.getMonth() + 1}-1`,
        }),
      },
    });

    const data = await this.invoiceRepo.query(
      `SELECT sale_month, month_total, SUM(month_total) OVER (
          ORDER BY sale_month ASC rows 11 preceding
        ) AS sum_series
        FROM (
          SELECT date_trunc('month', register_date) AS sale_month
              ,sum(total_amount) AS month_total
          FROM invoices
          GROUP BY 1
          ORDER BY 1
        ) t;`,
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

    return dashboardData;
  }
}
