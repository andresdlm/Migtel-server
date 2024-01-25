import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `
    SELECT
      date_trunc('month', invoices.register_date) AS sale_month,
      ROUND(sum(
        CASE
          WHEN invoices.currency_code = 'BS'
            THEN invoices.subtotal / invoices.exhange_rate
          ELSE invoices.subtotal
        END), 2)::double precision AS monthly_total
    FROM invoices
    GROUP BY (date_trunc('month', invoices.register_date))
    ORDER BY sale_month
  `,
  name: 'monthly_sales_view',
})
export class MonthlySalesView {
  @ViewColumn({ name: 'monthly_total' })
  monthlyTotal: number;
}
