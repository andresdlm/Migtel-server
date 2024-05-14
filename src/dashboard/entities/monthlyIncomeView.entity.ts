import { ColumnNumericTransformer } from 'src/common/colum-numeric-transformer';
import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `
  SELECT
    COALESCE(monthly_invoices.month_number, monthly_payments.month_number) AS month_number,
    COALESCE(monthly_invoices.month_string, monthly_payments.month_string) AS month,
    COALESCE(monthly_invoices.invoice_count, 0) AS invoices_count,
    COALESCE(monthly_invoices.monthly_income, 0) AS invoices_income,
    COALESCE(monthly_invoices.monthly_taxes, 0) AS taxes,
    COALESCE(monthly_payments.count_payments, 0) AS payments_count,
    COALESCE(monthly_payments.total_amount, 0) AS payments_income,
    (COALESCE(monthly_invoices.invoice_count, 0) + COALESCE(monthly_payments.count_payments, 0)) AS count_transactions_consolidated,
    (COALESCE(monthly_invoices.monthly_income, 0) + COALESCE(monthly_payments.total_amount, 0)) AS total_income_consolidated
  FROM
      (
      SELECT  ROW_NUMBER() OVER() AS index,  btrim(to_char(date_trunc('month'::text, payments.register_date), 'Month'::text))     AS month_string,
      date_part('month'::text, date_trunc('month'::text, payments.register_date))::integer AS month_number,
      COUNT(*)::integer AS count_payments,
      ROUND(COALESCE(SUM(
        CASE
            WHEN payments.currency_code = 'BS'
                THEN payments.amount / payments.exhange_rate
            ELSE payments.amount
        END
        ), 0::NUMERIC), 2) AS total_amount
      FROM payments
      WHERE payments.register_date >= (CURRENT_DATE - '1 year'::interval)
      GROUP BY (date_trunc('month'::text, payments.register_date))
      ORDER BY (date_trunc('month'::text, payments.register_date))
      OFFSET 1
      ) AS monthly_payments
  FULL OUTER JOIN (SELECT
          ROW_NUMBER() OVER() AS index,
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
      OFFSET 1) AS monthly_invoices
  ON monthly_payments.month_number = monthly_invoices.month_number
  ORDER BY monthly_invoices.index;
  `,
  name: 'monthly_income_view',
})
export class MonthlyIncomeView {
  @ViewColumn({ name: 'month_number' })
  monthNumber: number;

  @ViewColumn({ name: 'month' })
  month: string;

  @ViewColumn({ name: 'invoices_count' })
  invoicesCount: number;

  @ViewColumn({
    name: 'invoices_income',
    transformer: new ColumnNumericTransformer(),
  })
  invoicesIncome: number;

  @ViewColumn({
    name: 'taxes',
    transformer: new ColumnNumericTransformer(),
  })
  taxes: number;

  @ViewColumn({
    name: 'payments_count',
    transformer: new ColumnNumericTransformer(),
  })
  paymentsCount: number;

  @ViewColumn({
    name: 'payments_income',
    transformer: new ColumnNumericTransformer(),
  })
  paymentsIncome: number;

  @ViewColumn({
    name: 'count_transactions_consolidated',
    transformer: new ColumnNumericTransformer(),
  })
  transactionsCount: number;

  @ViewColumn({
    name: 'total_income_consolidated',
    transformer: new ColumnNumericTransformer(),
  })
  totalIncome: number;
}
