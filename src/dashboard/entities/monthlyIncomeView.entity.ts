import { ColumnNumericTransformer } from 'src/common/colum-numeric-transformer';
import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `
    SELECT
      ROUND(COALESCE(sum(
        CASE
          WHEN invoices.currency_code::text = 'BS'::text
            THEN invoices.iva / invoices.exhange_rate
          ELSE invoices.iva
        END::numeric), 0::numeric), 2) AS monthly_taxes,
      ROUND(COALESCE(sum(
        CASE
          WHEN invoices.currency_code::text = 'BS'::text
            THEN invoices.subtotal / invoices.exhange_rate
          ELSE invoices.subtotal
        END::numeric), 0::numeric), 2) AS monthly_income
    FROM invoices
    WHERE invoices.type::text = 'FACT'::text
      AND invoices.canceled = false
      AND date_part('month'::text, invoices.register_date) = date_part('month'::text, now())
  `,
  name: 'monthly_income_view',
})
export class MonthlyIncomeView {
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
