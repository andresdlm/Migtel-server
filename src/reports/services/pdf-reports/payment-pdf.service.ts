import { Injectable } from '@nestjs/common';
import { PaymentReportDto } from 'src/reports/dtos/reports.dtos';
import { HTML } from 'src/reports/types/report.type';
import { PuppeteerUtils } from 'src/reports/utils/puppeteer.utils';
import { ReportsUtilsService } from 'src/reports/utils/reports.utils';
import { IPdfReport, PaymentReport, Payment } from '../../models/pdf';
import { ReportsService } from '../reports.service';

@Injectable()
export class PaymentService implements IPdfReport {
  private dateNow = '';
  private report: PaymentReport;
  private params: PaymentReportDto;
  private pages: Map<number, Payment[]>;
  private paymentMethodName: string = '';
  private organizationName: string = '';

  constructor(
    private reportsUtils: ReportsUtilsService,
    private puppeteerUtils: PuppeteerUtils,
    private reportsService: ReportsService,
  ) {}

  public async generate(
    report: PaymentReport,
    params: PaymentReportDto,
    fileName?: string,
  ) {
    this.dateNow = this.reportsUtils.getCurrentDate();
    // Reset
    this.params = params;
    this.report = report;
    this.pages = new Map<number, Payment[]>();

    // Get payment method name here because await doesn't work when generating the HTML
    this.paymentMethodName = await this.reportsUtils.getPaymentMethodName(
      this.params,
    );

    this.organizationName = await this.reportsService.getOrganization(this.params.organizationId).then(
      (organization) => {
        let organizationSplitted = organization.name.split(' ');
        return organizationSplitted[3].toLocaleUpperCase();
      }
    );

    this.pages = this.reportsUtils.splice(report, 40);

    const html: HTML = this.getHtml() + this.reportsUtils.getStyles();
    const pdf = await this.puppeteerUtils.createPdf(html, fileName);

    return pdf;
  }

  private getHtml(): HTML {
    let html: HTML = '';
    let iterations: number = this.pages.size;

    if (this.pages.size > 0) {
      html += `
      <div>
        <!-- Start Report -->
        <div id="print-sales-book-report" class="report fontSize-header">
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
              <strong>REPORTES DE PAGOS
              `;

        if (this.params.organizationId) {
          html += `
            <span>
              ${this.organizationName}
            </span>`;
        }

        if (this.params.paymentMethod) {
          html += `<span> ${this.paymentMethodName} </span> `;
        }

        if (
          this.params.currencyCode === 'USD' ||
          this.params.currencyCode === 'BS'
        ) {
          html += `
                  <span> - ${this.params.currencyCode} </span>
                  `;
        }

        html += `
              </strong>
            </p>
            <hr />

            <table class="mt-2 fontSize-table w-100">
              <thead>
                <tr>
                  <th>ID CLIENTE</th>
                  <th>NOMBRE</th>
                  <th>CI/RIF</th>
                  <th>FECHA REGISTRO</th>
                  <th>MÉTODO DE PAGO</th>
                  <th class="text-center">MONTO BS</th>
                  <th class="text-center">MONTO USD</th>
                  <th class="text-center">TASA</th>
                </tr>
              </thead>
              <tbody>
              `;

        for (const payment of report) {
          html += `
                <tr class="reduce-font-weight">
                  <th>${payment.clientId}</th>
                  <th>${this.reportsUtils.getName(payment)}</th>
                  <th>${payment.clientDocument}</th>
                  <th>${this.reportsUtils.formatDate(payment.registerDate)}</th>
                  <th>${payment.paymentMethod.name}</th>
                  <th style="text-align: right">
                    Bs. ${this.reportsUtils.formatAmount(
                      this.reportsUtils.returnBs(payment),
                    )}
                  </th>
                  <th style="text-align: right">
                    $ ${this.reportsUtils.formatAmount(
                      this.reportsUtils.returnUSD(payment),
                    )}
                  </th>
                  <th style="text-align: right">
                    ${this.reportsUtils.formatAmount(payment.exhangeRate)}
                  </th>
                </tr>
                `;
        }

        if (iterations === 0) {
          html += `
                <tr>
                  <th>CANTIDAD: ${this.report.summary.count_payments}</th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th>TOTAL:</th>
                  <th style="text-align: right">
                    Bs ${this.reportsUtils.formatAmount(
                      this.report.summary.total_bs,
                    )}
                  </th>
                  <th style="text-align: right">
                    $ ${this.reportsUtils.formatAmount(
                      this.report.summary.total_usd,
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
