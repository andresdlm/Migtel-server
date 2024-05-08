import { ColumnNumericTransformer } from 'src/common/colum-numeric-transformer';
import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `
    SELECT
      TRIM(TO_CHAR(DATE_TRUNC('month', register_date), 'Month')) AS month_string,
      EXTRACT(MONTH FROM DATE_TRUNC('month', register_date))::integer AS month_number,
      COUNT(*)::integer AS invoice_count,
      ROUND(COALESCE(sum(
      CASE
        WHEN invoices.currency_code::text = 'BS'::text
          THEN invoices.subtotal / invoices.exhange_rate
        ELSE invoices.subtotal
      END), 0::numeric), 2) AS monthly_income,
      ROUND(COALESCE(sum(
        CASE
          WHEN invoices.currency_code::text = 'BS'::text
            THEN invoices.iva / invoices.exhange_rate
          ELSE invoices.iva
        END), 0::numeric), 2) AS monthly_taxes
    FROM
      invoices
    WHERE
      register_date >= CURRENT_DATE - INTERVAL '12 months' AND
      invoices.type = 'FACT'
    GROUP BY
      DATE_TRUNC('month', register_date)
    ORDER BY
      DATE_TRUNC('month', register_date)
    OFFSET 1;
  `,
  name: 'monthly_income_view',
})
export class MonthlyIncomeView {
  @ViewColumn({ name: 'month_string' })
  monthString: string;

  @ViewColumn({ name: 'month_number' })
  monthNumber: number;

  @ViewColumn({ name: 'invoice_count' })
  invoiceCount: number;

  @ViewColumn({
    name: 'monthly_income',
    transformer: new ColumnNumericTransformer(),
  })
  monthlyIncome: number;

  @ViewColumn({
    name: 'monthly_taxes',
    transformer: new ColumnNumericTransformer(),
  })
  monthlyTaxes: number;
}
