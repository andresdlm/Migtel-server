import { ColumnNumericTransformer } from 'src/common/colum-numeric-transformer';
import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `
    SELECT
      date_trunc('month', invoices.register_date) AS sale_month,
      ROUND(COALESCE(SUM(
        CASE
          WHEN invoices.currency_code = 'BS'
            THEN invoices.subtotal / invoices.exhange_rate
          ELSE invoices.subtotal
        END::numeric), 0::numeric), 2) AS monthly_total
    FROM invoices
    GROUP BY (date_trunc('month', invoices.register_date))
    ORDER BY sale_month;
  `,
  name: 'monthly_sales_view',
})
export class MonthlySalesView {
  @ViewColumn({
    name: 'monthly_total',
    transformer: new ColumnNumericTransformer(),
  })
  monthlyTotal: number;
}
