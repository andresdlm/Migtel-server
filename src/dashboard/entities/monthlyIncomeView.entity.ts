import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `
    SELECT
      COALESCE(sum(
        CASE
          WHEN invoices.currency_code::text = 'BS'::text
            THEN invoices.iva / invoices.exhange_rate
          ELSE invoices.iva
        END::double precision), 0::double precision) AS monthly_taxes,
      COALESCE(sum(
        CASE
          WHEN invoices.currency_code::text = 'BS'::text
            THEN invoices.subtotal / invoices.exhange_rate
          ELSE invoices.subtotal
        END::double precision), 0::double precision) AS monthly_income
    FROM invoices
    WHERE invoices.type::text = 'FACT'::text
      AND invoices.canceled = false
      AND date_part('month'::text, invoices.register_date) = date_part('month'::text, now())
  `,
  name: 'monthly_income_view',
})
export class MonthlyIncomeView {
  @ViewColumn({ name: 'monthly_income' })
  monthlyIncome: number;

  @ViewColumn({ name: 'monthly_taxes' })
  monthlyTaxes: number;
}
