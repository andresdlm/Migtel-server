import { Injectable } from '@nestjs/common';
import { ReportDto } from 'src/reports/dtos/reports.dtos';
import { HTML } from 'src/reports/types/report.type';
import { PuppeteerUtils } from 'src/reports/utils/puppeteer.utils';
import { ReportsUtilsService } from 'src/reports/utils/reports.utils';
import {
  IPdfReport,
  RetentionsReport,
  InvoiceLikeEntity as Invoice,
} from '../../models/pdf';

@Injectable()
export class RetentionsService implements IPdfReport {
  private dateNow = new Date().toLocaleDateString();
  private dates: ReportDto | null = null;
  private retentionsReport: RetentionsReport | null = null;
  private pages: Map<number, Invoice[]>;

  constructor(
    private reportsUtils: ReportsUtilsService,
    private puppeteerUtils: PuppeteerUtils,
  ) {}

  public async generate(
    report: RetentionsReport,
    params: ReportDto,
    fileName?: string,
  ) {
    this.dates = params;
    this.retentionsReport = report;
    this.pages = new Map<number, Invoice[]>();

    this.pages = this.reportsUtils.splice(report, 40);

    const html: HTML = this.getHtml() + this.reportsUtils.getStyles();
    const pdf = await this.puppeteerUtils.createPdf(html, fileName);

    return pdf;
  }

  private getHtml(): HTML {
    let html: HTML = '';
    let iterations: number = this.pages.size;

    if (this.retentionsReport) {
      html += `
      <div>
        <!-- Start Report -->
        <div id="print-sales-book-report" class="mt-4 report fontSize-header">
          `;

      for (const [key, report] of this.pages) {
        iterations--;

        html += `
            <div class="page">
              <div class="d-flex flex-column fontSize-header">
                <div class="d-flex justify-content-between">
                  <div>
                    <p>COMUNICACIONES MIGTEL C. A.</p>
                    `;

        if (this.dates) {
          html += `
                      <p>
                        <strong>Emisión:</strong> Desde
                        ${this.reportsUtils.formatDate(this.dates.since)} hasta
                        ${this.reportsUtils.formatDate(this.dates.until)}
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
                <strong>REPORTE DE RETENCIONES</strong>
              </p>
              <hr />
              <table class="mt-2 fontSize-table" style="width: 100%">
                <thead>
                  <tr>
                    <th>FECHA</th>
                    <th>TIPO</th>
                    <th>NÚMERO</th>
                    <th>FACT AFEC</th>
                    <th>NOMBRE O RAZON SOCIAL</th>
                    <th>RIF/CI</th>
                    <th class="text-center">VALOR</th>
                    <th class="text-center">IVA</th>
                    <th class="text-center">TOTAL FACT</th>
                    <th class="text-center">IVA RETENIDO</th>
                    <th class="text-center">IVA PERCIBIDO</th>
                    <th class="text-center">IGTF</th>
                    <th class="text-center">ISLR</th>
                    <th class="text-center">NETO</th>
                  </tr>
                </thead>

                <tbody>
                  `;

        for (const invoice of report) {
          html += `
                    <tr class="reduceFontWeight">
                      <th>${this.reportsUtils.formatDate(
                        invoice.registerDate,
                      )}</th>
                      <th>${invoice.type}</th>
                      <th>${invoice.invoiceNumber}</th>
                      `;

          if (invoice.type === 'N/C') {
            html += `<th>${invoice.comment}</th>`;
          }

          if (invoice.type !== 'N/C') {
            html += `<th></th>`;
          }

          html += `
                      <th class="text-truncate" style="max-width: 250px">
                        ${this.reportsUtils.getName(invoice)}
                      </th>
                      <th>${invoice.clientDocument}</th>
                      `;

          if (invoice.currencyCode === 'USD') {
            html += `
                        <div>
                          <th style="text-align: right">
                            ${this.reportsUtils.formatAmount(
                              invoice.subtotal * invoice.exhangeRate,
                            )}
                          </th>
                          <th style="text-align: right">
                            ${this.reportsUtils.formatAmount(
                              invoice.iva * invoice.exhangeRate,
                            )}
                          </th>
                          <th style="text-align: right">
                            ${this.reportsUtils.formatAmount(
                              invoice.totalAmount * invoice.exhangeRate,
                            )}
                          </th>
                          <th style="text-align: right">
                            ${this.reportsUtils.formatAmount(
                              invoice.iva_r * invoice.exhangeRate,
                            )}
                          </th>
                          <th style="text-align: right">
                            ${this.reportsUtils.formatAmount(
                              invoice.iva_p * invoice.exhangeRate,
                            )}
                          </th>
                          <th style="text-align: right">
                            ${this.reportsUtils.formatAmount(
                              invoice.igtf * invoice.exhangeRate,
                            )}
                          </th>
                          <th style="text-align: right">
                            ${this.reportsUtils.formatAmount(
                              invoice.islr * invoice.exhangeRate,
                            )}
                          </th>
                          <th style="text-align: right">
                            ${this.reportsUtils.formatAmount(
                              (invoice.totalAmount -
                                invoice.iva_r -
                                invoice.islr) *
                                invoice.exhangeRate,
                            )}
                          </th>
                        </div>
                        `;
          } else {
            html += `
                        <div>
                          <th style="text-align: right">
                            ${this.reportsUtils.formatAmount(invoice.subtotal)}
                          </th>
                          <th style="text-align: right">
                            ${this.reportsUtils.formatAmount(invoice.iva)}
                          </th>
                          <th style="text-align: right">
                            ${this.reportsUtils.formatAmount(
                              invoice.totalAmount,
                            )}
                          </th>
                          <th style="text-align: right">
                            ${this.reportsUtils.formatAmount(invoice.iva_r)}
                          </th>
                          <th style="text-align: right">
                            ${this.reportsUtils.formatAmount(invoice.iva_p)}
                          </th>
                          <th style="text-align: right">
                            ${this.reportsUtils.formatAmount(invoice.igtf)}
                          </th>
                          <th style="text-align: right">
                            ${this.reportsUtils.formatAmount(invoice.islr)}
                          </th>
                          <th style="text-align: right">
                            ${(
                              invoice.totalAmount -
                              invoice.iva_r -
                              invoice.islr
                            ).toFixed(2)}
                          </th>
                        </div>
                        `;
          }

          html += `
                    </tr>
                    `;
        }

        if (iterations === 0) {
          html += `
                    <tr>
                      <th>
                        Cant. fact:
                        ${this.retentionsReport.summary.total_invoices}
                      </th>
                      <th>
                        Válidas:
                        ${
                          this.retentionsReport.summary.total_invoices -
                          this.retentionsReport.summary.total_invoices_canceled
                        }
                      </th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th>TOTALES:</th>
                      <th style="text-align: right">
                        ${this.reportsUtils.formatAmount(
                          this.retentionsReport.summary.total_subtotal,
                        )}
                      </th>
                      <th style="text-align: right">
                        ${this.reportsUtils.formatAmount(
                          this.retentionsReport.summary.total_iva,
                        )}
                      </th>
                      <th style="text-align: right">
                        ${this.reportsUtils.formatAmount(
                          this.retentionsReport.summary.total_amount,
                        )}
                      </th>
                      <th style="text-align: right">
                        ${this.reportsUtils.formatAmount(
                          this.retentionsReport.summary.total_iva_r,
                        )}
                      </th>
                      <th style="text-align: right">
                        ${this.reportsUtils.formatAmount(
                          this.retentionsReport.summary.total_iva_p,
                        )}
                      </th>
                      <th style="text-align: right">
                        ${this.reportsUtils.formatAmount(
                          this.retentionsReport.summary.total_igtf,
                        )}
                      </th>
                      <th style="text-align: right">
                        ${this.reportsUtils.formatAmount(
                          this.retentionsReport.summary.total_islr,
                        )}
                      </th>
                      <th style="text-align: right">
                        ${this.reportsUtils.formatAmount(
                          this.retentionsReport.summary.total_neto,
                        )}
                      </th>
                      <th></th>
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
