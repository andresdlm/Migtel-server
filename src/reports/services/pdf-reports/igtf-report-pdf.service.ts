import { Injectable } from '@nestjs/common';
import { ReportDto } from 'src/reports/dtos/reports.dtos';
import { Igtf } from 'src/reports/models/reports.model';
import { HTML } from 'src/reports/types/report.type';
import { PuppeteerUtils } from 'src/reports/utils/puppeteer.utils';
import { ReportsUtilsService } from 'src/reports/utils/reports.utils';
import { IgtfBook, IPdfReport } from '../../models/pdf';

@Injectable()
export class IgtfService implements IPdfReport {
  private dateNow = new Date().toLocaleDateString();
  private params: ReportDto | null = null;
  private report: IgtfBook | null = null;
  private pages: Map<number, Igtf[]>;

  constructor(
    private reportsUtils: ReportsUtilsService,
    private puppeteerUtils: PuppeteerUtils,
  ) {}

  public async generate(
    report: IgtfBook,
    params: ReportDto,
    fileName?: string,
  ) {
    this.params = params;
    this.report = report;
    this.pages = new Map<number, Igtf[]>();

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
                    <p *ngIf="igtfBookDto">
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
              <strong>REPORTE DE IGTF</strong>
            </p>
            <hr />
            <table class="mt-2 fontSize-table" style="width: 100%">
              <thead>
                <tr>
                  <th>NÚMERO</th>
                  <th>CLIENTE</th>
                  <th>FECHA</th>
                  <th>COC</th>
                  <th class="text-center">IMPONIBLE</th>
                  <th class="text-center">IGTF</th>
                </tr>
              </thead>

              <tbody>
              `;

        for (const invoice of report) {
          html += `
                  <tr class="reduceFontWeight">
                    <th>${invoice.invoice_number}</th>
                    <th class="text-truncate" style="max-width: 280px">
                      ${this.reportsUtils.getName(invoice)}
                    </th>
                    <th>${this.reportsUtils.formatDate(
                      invoice.register_date,
                    )}</th>
                    <th>${invoice.payment_method_name}</th>
                    <th style="text-align: right">
                      Bs ${this.reportsUtils.formatAmount(invoice.imponible)}
                    </th>
                    <th style="text-align: right">
                      Bs ${this.reportsUtils.formatAmount(invoice.igtf)}
                    </th>
                  </tr>
                  `;
        }
        if (iterations === 0) {
          html += `
                  <tr *ngIf="lastPage">
                    <th>TOTAL FACT: ${this.report.summary.total_invoices}</th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th style="text-align: right">
                      Bs ${this.reportsUtils.formatAmount(
                        this.report.summary.total_imponible,
                      )}
                    </th>
                    <th style="text-align: right">
                      Bs ${this.reportsUtils.formatAmount(
                        this.report.summary.total_igtf,
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
