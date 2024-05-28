import { Injectable } from '@nestjs/common';
import { SalesBookReportDto } from 'src/reports/dtos/reports.dtos';
import { HTML } from 'src/reports/types/report.type';
import { PuppeteerUtils } from 'src/reports/utils/puppeteer.utils';
import { ReportsUtilsService } from 'src/reports/utils/reports.utils';
import {
  IPdfReport,
  SalesBookInvoice,
  SalesBookReport,
} from '../../models/pdf';

@Injectable()
export class SalesBookService implements IPdfReport {
  private dateNow = '';
  private report: SalesBookReport | null = null;
  private params: SalesBookReportDto = {
    organizationId: 0,
    clientType: 0,
    paymentMethod: 0,
    since: new Date(), // mm-dd-yyyy
    until: new Date(),
    currencyReport: 'BS',
  };
  private pages: Map<number, SalesBookInvoice[]>;
  private paymentMethodName: string = '';

  constructor(
    private reportsUtils: ReportsUtilsService,
    private puppeteerUtils: PuppeteerUtils,
  ) {}

  public async generate(
    report: SalesBookReport,
    params: SalesBookReportDto,
    fileName?: string,
  ) {
    this.dateNow = this.reportsUtils.getCurrentDate();
    // Reset
    this.params = params;
    this.report = report;
    this.pages = new Map<number, SalesBookInvoice[]>();

    this.pages = this.reportsUtils.splice(report, 40);

    // Get payment method name here because await doesn't work when generating the HTML
    this.paymentMethodName = await this.reportsUtils.getPaymentMethodName(
      this.params,
    );

    const html: HTML = this.getHtml() + this.reportsUtils.getStyles();
    const pdf = await this.puppeteerUtils.createPdf(html, fileName);

    return pdf;
  }

  private getHtml(): HTML {
    let html: HTML = '';
    let iterations: number = this.pages.size;

    if (this.report) {
      html += `
      <div>
        <!-- Start Report -->
        <div id="print-sales-book-report" class="report fontSize-header">
        `;

      for (const [key, invoiceReportPage] of this.pages) {
        iterations--;

        html += `
          <div class="page">
            <div class="d-flex flex-column fontSize-header">
              <div class="d-flex justify-content-between">
                <div>
                  <p>COMUNICACIONES MIGTEL C. A.</p>
                  `;
        if (this.params) {
          html += `
                    <p>
                      <strong>Emisión:</strong> Desde
                      ${this.reportsUtils.formatDate(this.params.since)} hasta
                      ${this.reportsUtils.formatDate(this.params.until)}
                    </p>
                    `;
        }
        html += `
                </div>
                <div>
                  <p>
                    <strong>Fecha emisión:</strong>
                    ${this.reportsUtils.formatDate(this.dateNow)}
                  </p>
                  <p>Página ${key}/${this.pages.size}</p>
                </div>
              </div>
            </div>
            <hr />
            <p class="text-center border-dark border-3 fontSize-header">
              <strong>LIBRO DE VENTAS
                `;
        if (this.params.organizationId) {
          html += `
                  <span>
                    ${this.reportsUtils.getOrganization(this.params)}
                  </span>
                  `;
        }

        if (this.params.clientType) {
          html += `
                  <span>
                    ${this.reportsUtils.getClientType(this.params)}
                  </span>
                  `;
        }

        if (this.params.paymentMethod) {
          html += `
                  <span>
                    ${this.paymentMethodName}
                  </span>
                  `;
        }

        if (this.params.currencyReport !== 'BS') {
          html += `
                  <span>
                    ${this.params.currencyReport}
                  </span>
                  `;
        }

        html += `
              </strong>
            </p>
            <hr />

            <table class="mt-2 fontSize-table w-100">
              <thead>
                <tr>
                  <th>FECHA</th>
                  <th>TIPO</th>
                  <th>NÚMERO</th>
                  <th>CLIENTE</th>
                  <th>FACT AFEC</th>
                  <th>NOMBRE O RAZON SOCIAL</th>
                  <th>RIF/CI</th>
                  <th class="text-center">VALOR</th>
                  <th class="text-center">IVA</th>
                  <th class="text-center">TOTAL FACT</th>
                  <th class="text-center">IVA R</th>
                  <th class="text-center">IVA P</th>
                  <th class="text-center">IGTF</th>
                  <th class="text-center">ISLR</th>
                  <th class="text-center">NETO</th>
                </tr>
              </thead>
              <tbody>
              `;

        for (const invoice of invoiceReportPage) {
          html += `
                <tr class="reduce-font-weight">
                  <th>${this.reportsUtils.formatDate(
                    invoice.register_date,
                  )}</th>
                  <th>${invoice.type}</th>
                  <th>${invoice.invoice_number}</th>
                  <th>${invoice.client_id}</th>
                  `;

          if (invoice.type === 'N/C') {
            html += `<th>${invoice.comment}</th>`;
          }

          if (invoice.type !== 'N/C') {
            html += `<th></th>`;
          }

          html += `
                  <th class="text-truncate" style="max-width: 220px">
                    ${this.reportsUtils.getName(invoice)}
                  </th>
                  <th>${invoice.client_document}</th>
                  <th class="text-end">
                    ${this.reportsUtils.formatAmount(invoice.subtotal)}
                  </th>
                  <th class="text-end">
                    ${this.reportsUtils.formatAmount(invoice.iva)}
                  </th>
                  <th class="text-end">
                    ${this.reportsUtils.formatAmount(invoice.total_amount)}
                  </th>
                  <th class="text-end">
                    ${this.reportsUtils.formatAmount(invoice.iva_r)}
                  </th>
                  <th class="text-end">
                    ${this.reportsUtils.formatAmount(invoice.iva_p)}
                  </th>
                  <th class="text-end">
                    ${this.reportsUtils.formatAmount(invoice.igtf)}
                  </th>
                  <th class="text-end">
                    ${this.reportsUtils.formatAmount(invoice.islr)}
                  </th>
                  <th class="text-end">
                    ${this.reportsUtils.formatAmount(invoice.neto)}
                  </th>
                </tr>
                `;
        }

        if (iterations === 0) {
          html += `
                <tr>
                  <th>
                    Cant. fact:
                    ${this.report.summary.total_invoices}
                  </th>
                  <th>
                    Válidas:
                    ${
                      this.report.summary.total_invoices -
                      this.report.summary.total_invoices_canceled
                    }
                  </th>
                  <th>
                    Anuladas:
                    ${this.report.summary.total_invoices_canceled}
                  </th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th>TOTALES:</th>
                  <th class="text-end">
                    ${this.reportsUtils.formatAmount(
                      this.report.summary.total_subtotal,
                    )}
                  </th>
                  <th class="text-end">
                    ${this.reportsUtils.formatAmount(
                      this.report.summary.total_iva,
                    )}
                  </th>
                  <th class="text-end">
                    ${this.reportsUtils.formatAmount(
                      this.report.summary.total_amount,
                    )}
                  </th>
                  <th class="text-end">
                    ${this.reportsUtils.formatAmount(
                      this.report.summary.total_iva_r,
                    )}
                  </th>
                  <th class="text-end">
                    ${this.reportsUtils.formatAmount(
                      this.report.summary.total_iva_p,
                    )}
                  </th>
                  <th class="text-end">
                    ${this.reportsUtils.formatAmount(
                      this.report.summary.total_igtf,
                    )}
                  </th>
                  <th class="text-end">
                    ${this.reportsUtils.formatAmount(
                      this.report.summary.total_islr,
                    )}
                  </th>
                  <th class="text-end">
                    ${this.reportsUtils.formatAmount(
                      this.report.summary.total_neto,
                    )}
                  </th>
                </tr>
                `;
        }

        html += `
              </tbody>
            </table>
          </div>
          `;
      }

      html += `
        </div>
        <!--End Report-->
      </div>
      `;
    }

    return html;
  }
}
