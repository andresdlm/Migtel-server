import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `
    SELECT
      payment_methods.id,
      payment_methods.name,
      count(invoices.*)::integer AS count,
      COALESCE(sum(
        CASE
          WHEN invoices.currency_code = 'BS'
            THEN invoices.subtotal / invoices.exhange_rate
          ELSE invoices.subtotal
        END::double precision), 0::double precision) AS y
    FROM payment_methods
    LEFT JOIN invoices ON payment_methods.id = invoices.payment_method_id
    WHERE invoices.type = 'FACT'
      AND invoices.canceled = false
      AND date_part('month', invoices.register_date) = date_part('month', CURRENT_DATE)
    GROUP BY payment_methods.id
    ORDER BY y DESC, payment_methods.id
  `,
  name: 'monthly_account_income_view',
})
export class MonthlyAccountIncomeView {
  @ViewColumn()
  id: number;

  @ViewColumn()
  name: string;

  @ViewColumn()
  count: number;

  @ViewColumn()
  y: number;
}
