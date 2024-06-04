import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { PortalReportDto } from 'src/reports/dtos/reports.dtos';
import { HTML } from 'src/reports/types/report.type';
import { PuppeteerUtils } from 'src/reports/utils/puppeteer.utils';
import { ReportsUtilsService } from 'src/reports/utils/reports.utils';
import { ReportsService } from '../reports.service';
import {
  IPdfReport,
  PortalPayment,
  PortalPaymentReport,
} from '../../models/pdf';

@Injectable()
export class PortalPaymentService implements IPdfReport {
  private dateNow = '';
  private portalPaymentDto: PortalReportDto | null = null;
  private portalPaymentReport: PortalPaymentReport | null = null;
  private portalPaymentReportPages: Map<number, PortalPayment[]>;
  private paymentMethodName: string = '';

  constructor(
    private reportsUtils: ReportsUtilsService,
    private puppeteerUtils: PuppeteerUtils,
    private reportsService: ReportsService,
  ) {}

  public async generate(
    report: PortalPaymentReport,
    params: PortalReportDto,
    fileName?: string,
  ) {
    this.dateNow = this.reportsUtils.getCurrentDate();
    this.portalPaymentDto = params;
    this.portalPaymentReport = report;
    this.portalPaymentReportPages = new Map<number, PortalPayment[]>();

    this.portalPaymentReportPages = this.reportsUtils.splice(report, 40);

    this.paymentMethodName = await this.getPaymentMethodName();

    const html: HTML = this.getHtml() + this.reportsUtils.getStyles();
    const pdf = await this.puppeteerUtils.createPdf(html, fileName);

    return pdf;
  }

  private async getPaymentMethods() {
    const paymentMethods = await this.reportsService.getPortalPaymentMethods();
    const paymentMethodsRes = await firstValueFrom(paymentMethods);
    return paymentMethodsRes;
  }

  private async getPaymentMethodName() {
    const paymentMethods = await this.getPaymentMethods();
    const paymentMethod = paymentMethods.find((paymentMethod) => {
      return paymentMethod.id === Number(this.portalPaymentDto?.paymentMethod);
    });
    return paymentMethod?.name.toLocaleUpperCase();
  }

  private getHtml(): HTML {
    let html: HTML = '';
    let iterations: number = this.portalPaymentReportPages.size;

    if (this.portalPaymentReport) {
      html += `
      <div>
        <!-- Start Report -->
        <div id="print-sales-book-report" class="mt-4 report fontSize-header">
          `;

      for (const [key, report] of this.portalPaymentReportPages) {
        iterations--;

        html += `
            <div class="page">
              <div class="d-flex flex-column fontSize-header">
                <div class="d-flex justify-content-between">
                  <div>
                    <p>COMUNICACIONES MIGTEL C. A.</p>
                    `;

        if (this.portalPaymentDto) {
          html += `
                      <p>
                        <strong>Emisión:</strong> Desde
                        ${this.reportsUtils.formatDate(
                          this.portalPaymentDto.since,
                        )} hasta
                        ${this.reportsUtils.formatDate(
                          this.portalPaymentDto.until,
                        )}
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
                    <p>
                      Página ${key}/${this.portalPaymentReportPages.size}
                    </p>
                  </div>
                </div>
              </div>
              <hr />
              <p class="text-center border-dark border-3 fontSize-header">
                <strong>REPORTE DE PAGOS ONLINE ${
                  this.paymentMethodName
                }</strong>
              </p>
              <hr />
              <table class="mt-2 fontSize-table" style="width: 100%">
                <thead>
                  <tr>
                    <th>CLIENT ID</th>
                    <th>NAME</th>
                    <th>FECHA</th>
                    <th>REFERENCIA</th>
                    <th>MONEDA</th>
                    <th>METODO</th>
                    <th>N FACTURA</th>
                    <th style="text-align: right">TASA</th>
                    <th style="text-align: right">SUBTOTAL</th>
                    <th style="text-align: right">IGTF</th>
                    <th style="text-align: right">TOTAL</th>
                  </tr>
                </thead>

                <tbody>
                `;

        for (const payment of report) {
          html += `
                    <tr class="reduceFontWeight">
                      <th>${payment.clientId}</th>
                      <th>${this.reportsUtils.getName(payment)}</th>
                      <th>${this.reportsUtils.formatDate(
                        payment.registerDate,
                      )}</th>
                      <th>${payment.reference}</th>
                      <th>${payment.currency}</th>
                      <th>${payment.paymentMethod.name}</th>
                      `;

          if (payment.invoiceNumber) {
            html += `<th>${payment.invoiceNumber}</th>`;
          } else {
            html += `<th></th>`;
          }

          html += `
                      <th style="text-align: right">${this.reportsUtils.formatAmount(
                        payment.exchangeRate,
                      )}</th>
                      <th style="text-align: right">${this.reportsUtils.formatAmount(
                        payment.subtotal,
                      )}</th>
                      <th style="text-align: right">${this.reportsUtils.formatAmount(payment.igtf)}</th>
                      <th style="text-align: right">${this.reportsUtils.formatAmount(
                        payment.totalAmount,
                      )}</th>
                    </tr>
                    `;
        }

        if (iterations === 0) {
          html += `
                    <tr style="border-top: 1px solid rgb(199, 199, 199)">
                      <th>
                        CANTIDAD DE PAGOS:
                        ${this.portalPaymentReport.summary.total_payments}
                      </th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th>MONTO TOTAL:</th>
                      <th>
                        ${this.reportsUtils.formatAmount(
                          this.portalPaymentReport.summary.total_amount,
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
