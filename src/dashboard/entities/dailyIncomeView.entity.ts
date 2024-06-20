import { ColumnNumericTransformer } from 'src/common/colum-numeric-transformer';
import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `
  SELECT
    invoice_daily_income.daily_income AS invoice_daily_income,
    payment_daily_income.daily_income AS payment_daily_income
  FROM (
    SELECT
        ROW_NUMBER() OVER() AS index,
        ROUND(COALESCE(SUM(
            CASE
            WHEN invoices.currency_code = 'BS'
                THEN invoices.subtotal / invoices.exhange_rate
            ELSE invoices.subtotal
            END)::numeric, 0::numeric), 2) AS daily_income
    FROM invoices
    WHERE invoices.type = 'FACT'
        AND invoices.canceled = false
        AND date_part('year', invoices.register_date) = date_part('year', CURRENT_DATE)
        AND date_part('month', invoices.register_date) = date_part('month', CURRENT_DATE)
        AND date_part('day', invoices.register_date) = date_part('day', CURRENT_DATE)
    ) AS invoice_daily_income
  INNER JOIN (
    SELECT
        ROW_NUMBER() OVER() AS index,
        ROUND(COALESCE(SUM(
            CASE
            WHEN payments.currency_code = 'BS'
                THEN payments.amount / payments.exhange_rate
            ELSE payments.amount
            END)::numeric, 0::numeric), 2) AS daily_income
    FROM payments
    WHERE date_part('year', payments.register_date) = date_part('year', CURRENT_DATE)
        AND date_part('month', payments.register_date) = date_part('month', CURRENT_DATE)
        AND date_part('day', payments.register_date) = date_part('day', CURRENT_DATE)
    ) AS payment_daily_income
    ON invoice_daily_income.index = payment_daily_income.index
  `,
  name: 'daily_income_view',
})
export class DailyIncomeView {
  @ViewColumn({
    name: 'invoice_daily_income',
    transformer: new ColumnNumericTransformer(),
  })
  invoiceDailyIncome: number;

  @ViewColumn({
    name: 'payment_daily_income',
    transformer: new ColumnNumericTransformer(),
  })
  paymentDailyIncome: number;
}
