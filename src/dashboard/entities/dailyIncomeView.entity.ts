import { ColumnNumericTransformer } from 'src/common/colum-numeric-transformer';
import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `
    SELECT
      ROUND(COALESCE(SUM(
        CASE
          WHEN invoices.currency_code = 'BS'
            THEN invoices.subtotal / invoices.exhange_rate
          ELSE invoices.subtotal
        END)::numeric, 0::numeric), 2) AS daily_income
    FROM invoices
    WHERE invoices.type = 'FACT'
      AND invoices.canceled = false
      AND date_part('month', invoices.register_date) = date_part('month', CURRENT_DATE)
      AND date_part('day', invoices.register_date) = date_part('day', CURRENT_DATE)
  `,
  name: 'daily_income_view',
})
export class DailyIncomeView {
  @ViewColumn({
    name: 'daily_income',
    transformer: new ColumnNumericTransformer(),
  })
  dailyIncome: number;
}
