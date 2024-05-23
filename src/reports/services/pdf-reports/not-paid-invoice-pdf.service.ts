import { Injectable } from '@nestjs/common';
import { HTML } from 'src/reports/types/report.type';
import { PuppeteerUtils } from 'src/reports/utils/puppeteer.utils';
import { ReportsUtilsService } from 'src/reports/utils/reports.utils';
import { IPdfReport, PaidInvoice, InvoiceLikeEntity as Invoice } from '../../models/pdf';

@Injectable()
export class NotPaidInvoiceService implements IPdfReport {

  private dateNow = new Date().toLocaleDateString();
  private report: PaidInvoice | null = null;
  private pages: Map<number, Invoice[]>;

  constructor(private reportsUtils: ReportsUtilsService, private puppeteerUtils: PuppeteerUtils) {}

  public async generate(report: PaidInvoice, params: any, fileName?: string) {
    this.report = report;
    this.pages = new Map<number, Invoice[]>();

    this.pages = this.reportsUtils.splice(report, 40);

    const html: HTML = this.getHtml() + this.reportsUtils.getStyles();
    const pdf = await this.puppeteerUtils.createPdf(html, fileName);

    return pdf;
  }

  private getHtml(): HTML {
    let html: HTML = '';
    let iterations: number = this.pages.size;

    if(this.report) {
      html += `
      <div>
        <!-- Start Report -->
        <div id="print-sales-book-report" class="mt-4 report fontSize-header">
        `;

          for(const [key, report] of this.pages) {
            iterations--;

            html += `
            <div class="page">
              <div class="d-flex flex-column fontSize-header">
                <div class="d-flex justify-content-between">
                  <div>
                    <p>COMUNICACIONES MIGTEL C. A.</p>
                  </div>
                  <div>
                    <p>
                      <strong>Fecha emisión:</strong>
                      ${ this.reportsUtils.formatDate(this.dateNow) }
                    </p>
                    <p>Página ${ key }/${ this.pages.size }</p>
                  </div>
                </div>
              </div>
              <hr />
              <p class="text-center border-dark border-3 fontSize-header">
                <strong>REPORTE DE FACTURAS NO PAGADAS</strong>
              </p>
              <hr />
              <table class="mt-2 fontSize-table" style="width: 100%">
                <thead>
                  <tr>
                    <th>Nº FACT</th>
                    <th>ID CLIENTE</th>
                    <th>NOMBRE O RAZON SOCIAL</th>
                    <th>RIF/CI</th>
                    <th>COC</th>
                    <th>TASA</th>
                    <th class="text-center">MONTO BS</th>
                    <th class="text-center">MONTO USD</th>
                  </tr>
                </thead>
                <tbody>
                `;
                  for(const invoice of report) {
                    html += `
                    <tr class="reduceFontWeight">
                      <th>${ invoice.invoiceNumber }</th>
                      <th>${ invoice.clientId }</th>
                      <th
                        class="text-truncate"
                        style="max-width: 220px; text-transform: capitalize"
                      >
                        ${ this.reportsUtils.getName(invoice) }
                      </th>
                      <th>${ invoice.clientDocument }</th>
                      <th>${ invoice.paymentMethod.name }</th>
                      <th>${ this.reportsUtils.formatAmount(invoice.exhangeRate) }</th>
                      <th style="text-align: right">
                        `;

                        if(invoice.currencyCode === 'BS') {
                          html += `
                          <span>
                            Bs ${ this.reportsUtils.formatAmount(invoice.totalAmount) }
                          </span>
                          `;
                        } else {
                          html += `
                          <span>Bs
                          ${
                            this.reportsUtils.formatAmount(invoice.totalAmount * invoice.exhangeRate)
                          }</span>
                          `;
                        }

                        html += `
                      </th>
                      <th style="text-align: right">
                        `;

                        if(invoice.currencyCode === 'USD') {
                          html += `
                          <span>
                            $ ${ this.reportsUtils.formatAmount(invoice.totalAmount) }
                          </span>
                          `;
                        } else {
                          html += `
                          <span>$
                          ${
                            this.reportsUtils.formatAmount(invoice.totalAmount / invoice.exhangeRate)
                          }</sp>
                          `;
                        }

                        html += `
                      </th>
                    </tr>
                    `;
                  }

                  html += `
                </tbody>
                `;

                if(iterations === 0) {
                  html += `
                  <tfoot>
                    <th>Cant. Fact: ${ this.report.summary.total_invoices }</th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th style="text-align: right">
                      Total: Bs ${ this.reportsUtils.formatAmount(this.report.summary.total_bs) }
                    </th>
                    <th style="text-align: right">
                      Total: $ ${ this.reportsUtils.formatAmount(this.report.summary.total_usd) }
                    </th>
                  </tfoot>
                  `;
                }

                html += `
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
