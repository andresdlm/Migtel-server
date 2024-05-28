import { Injectable } from '@nestjs/common';
import { ReferenceDto } from 'src/reports/dtos/reports.dtos';
import { HTML } from 'src/reports/types/report.type';
import { PuppeteerUtils } from 'src/reports/utils/puppeteer.utils';
import { ReportsUtilsService } from 'src/reports/utils/reports.utils';
import {
  IPdfReport,
  ReferenceInvoice,
  InvoiceLikeEntity as Invoice,
} from '../../models/pdf';

@Injectable()
export class ReferenceInvoiceService implements IPdfReport {
  private dateNow = new Date().toLocaleDateString();
  private params: ReferenceDto | null = null;
  private report: ReferenceInvoice | null = null;
  private pages: Map<number, Invoice[]>;

  constructor(
    private reportsUtils: ReportsUtilsService,
    private puppeteerUtils: PuppeteerUtils,
  ) {}

  public async generate(
    report: ReferenceInvoice,
    params: ReferenceDto,
    fileName?: string,
  ) {
    this.params = params;
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

    if (this.report) {
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
                <strong>REFERENCIAS BANCARIAS DE FACTURAS</strong>
              </p>
              <hr />
              <table class="mt-2 fontSize-table" style="width: 100%">
                <thead>
                  <tr>
                    <th>Nº FACT</th>
                    <th>ID CLIENTE</th>
                    <th>NOMBRE O RAZON SOCIAL</th>
                    <th>RIF/CI</th>
                    <th>PERIODO</th>
                    <th>CARGADO POR</th>
                    <th>COC</th>
                    <th>TASA</th>
                    <th class="text-center">MONTO</th>
                    <th>REFERENCIA</th>
                    <th>COMENTARIO</th>
                  </tr>
                </thead>
                <tbody>
                `;

        for (const invoice of report) {
          html += `
                  <tr class="reduceFontWeight">
                    <th>${invoice.invoiceNumber}</th>
                    <th>${invoice.clientId}</th>
                    <th>${this.reportsUtils.getName(invoice)}</th>
                    <th>${invoice.clientDocument}</th>
                    <th>${invoice.period}</th>
                    <th>
                      ${invoice.user.employee.firstname}
                      ${invoice.user.employee.lastname}
                    </th>
                    <th>${invoice.paymentMethod.name}</th>
                    <th>${invoice.exhangeRate}</th>
                    <th style="text-align: right; padding-right: 15px">
                      `;

          html += `
                      ${
                        invoice.currencyCode === 'USD'
                          ? '<span>$</span>'
                          : '<span>Bs</span>'
                      }
                      ${this.reportsUtils.formatAmount(invoice.totalAmount)}
                    </th>
                    <th>${invoice.bankReference}</th>
                    <th>${invoice.comment.slice(0, 40)}</th>
                  </tr>
                  `;
        }

        html += `
                </tbody>
                `;

        if (iterations === 0) {
          html += `
                  <tfoot>
                    <th>Cant. Ref: ${this.report.summary.total_references}</th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th>
                      Total: $ ${this.reportsUtils.formatAmount(
                        this.report.summary.total_amount_usd,
                      )}
                    </th>
                    <th>
                      Total: Bs ${this.reportsUtils.formatAmount(
                        this.report.summary.total_amount_bs,
                      )}
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
