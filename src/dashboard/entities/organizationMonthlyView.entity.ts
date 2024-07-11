import { ColumnNumericTransformer } from 'src/common/colum-numeric-transformer';
import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `
    SELECT
        monthly_invoices.organization_id                                                                            AS organization_id,
        COALESCE(monthly_invoices.month_number, monthly_payments.month_number)                                      AS month_number,
        COALESCE(monthly_invoices.month_string, monthly_payments.month_string)                                      AS month,
        COALESCE(monthly_invoices.invoice_count, 0)                                                                 AS invoices_count,
        COALESCE(monthly_invoices.monthly_income, 0::numeric)                                                       AS invoices_income,
        COALESCE(monthly_invoices.monthly_taxes, 0::numeric)                                                        AS taxes,
        COALESCE(monthly_payments.count_payments, 0)                                                                AS payments_count,
        COALESCE(monthly_payments.total_amount, 0::numeric)                                                         AS payments_income,
        COALESCE(monthly_invoices.invoice_count, 0) + COALESCE(monthly_payments.count_payments, 0)                  AS count_transactions_consolidated,
        COALESCE(monthly_invoices.monthly_income, 0::numeric) + COALESCE(monthly_payments.total_amount, 0::numeric) AS total_income_consolidated
    FROM (
        SELECT
            row_number() OVER ()                                                                 AS index,
            organization_id                                                                      AS organization_id,
            btrim(to_char(date_trunc('month'::text, payments.register_date), 'Month'::text))     AS month_string,
            date_part('month'::text, date_trunc('month'::text, payments.register_date))::integer AS month_number,
            count(*)::integer                                                                    AS count_payments,
            round(COALESCE(sum(
                CASE
                WHEN payments.currency_code::text = 'BS'::text
                THEN payments.amount / payments.exhange_rate
                ELSE payments.amount
                END), 0::numeric), 2)                                     AS total_amount
        FROM payments
        WHERE payments.register_date >= ((date_trunc('month', CURRENT_DATE) + interval '1 month')::date - interval '1 year')
        GROUP BY organization_id, (date_trunc('month'::text, payments.register_date))
        ORDER BY (date_trunc('month'::text, payments.register_date)), payments.organization_id
    ) monthly_payments
    FULL JOIN (
        SELECT
            row_number() OVER () AS index,
            organization_id AS organization_id,
            TRIM(BOTH FROM to_char(date_trunc('month'::text, invoices.register_date), 'Month'::text)) AS month_string,
            EXTRACT(month FROM date_trunc('month'::text, invoices.register_date))::integer AS month_number,
            count(*)::integer AS invoice_count,
            round(COALESCE(sum(
                CASE
                    WHEN invoices.currency_code::text = 'BS'::text
                    THEN invoices.total_amount / invoices.exhange_rate
                    ELSE invoices.total_amount
                END), 0::numeric), 2) AS monthly_income,
            round(COALESCE(sum(
                CASE
                    WHEN invoices.currency_code::text = 'BS'::text
                    THEN invoices.iva / invoices.exhange_rate
                    ELSE invoices.iva
                END), 0::numeric), 2) AS monthly_taxes
        FROM invoices
        WHERE invoices.register_date >= ((date_trunc('month', CURRENT_DATE) + interval '1 month')::date - '1 year'::interval)
            AND invoices.type::text = 'FACT'::text
        GROUP BY organization_id, (date_trunc('month'::text, invoices.register_date))
        ORDER BY (date_trunc('month'::text, invoices.register_date))
    ) monthly_invoices
        ON monthly_payments.month_number = monthly_invoices.month_number
            AND monthly_invoices.organization_id = monthly_payments.organization_id
    ORDER BY monthly_invoices.index
  `,
  name: 'organization_monthly_view',
})
export class OrganizationMonthlyView {
  @ViewColumn({ name: 'organization_id' })
  organizationId: number;

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
