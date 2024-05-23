import { Injectable } from '@nestjs/common';
import { ReportDto } from 'src/reports/dtos/reports.dtos';
import { Account } from 'src/reports/models/reports.model';
import { HTML } from 'src/reports/types/report.type';
import { PuppeteerUtils } from 'src/reports/utils/puppeteer.utils';
import { ReportsUtilsService } from 'src/reports/utils/reports.utils';
import { AccountReport, IPdfReport } from '../../models/pdf';

@Injectable()
export class AccountPaymentService implements IPdfReport {

  private dateNow = new Date().toLocaleDateString();
  private report: AccountReport | null = null;
  private params: ReportDto | null = null;
  private pages: Map<number, Account[]>;

  constructor(private reportsUtils: ReportsUtilsService, private puppeteerUtils: PuppeteerUtils) {}

  public async generate(report: AccountReport, params: ReportDto, fileName?: string) {
    this.params = params;
    this.report = report;
    this.pages = new Map<number, Account[]>();

    this.pages = this.reportsUtils.splice(report, 19);

    const html: HTML = this.getHtml() + this.reportsUtils.getStyles();
    const pdf = await this.puppeteerUtils.createPdf(html, fileName);

    return pdf;
  }

  private getHtml(): HTML {
    let html: HTML = '';

    if(this.report) {
      html += `
      <div>
        <!-- Start Report -->
        <div id="print-account-report" class="report mt-4 test2 fontSize-header">
      `;

      for(const [key, accountReportPage] of this.pages) {
        html += `
          <div class="page">
            <div class="d-flex flex-column fontSize-header">
              <div class="d-flex justify-content-between">
                <div>
                  <p>COMUNICACIONES MIGTEL C. A.</p>
                  `;
                  if(this.params) {
                    html += `
                    <p>
                      <strong>Emisión:</strong> Desde
                      ${ this.reportsUtils.formatDate(this.params.since) } hasta
                      ${ this.reportsUtils.formatDate(this.params.until) }
                    </p>
                    `;
                  }

                html += `
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
            <p class="fontSize-header text-center">
              <strong>REPORTE DE CUENTAS DE FACTURAS</strong>
            </p>
            <hr />

            <table class="table table-hover mt-2">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NOMBRE</th>
                  <th><div>CANTIDAD DE PAGOS</div></th>
                  <th class="text-center"><div>BALANCE NETO USD</div></th>
                  <th class="text-center"><div>BALANCE NETO BS</div></th>
                </tr>
              </thead>
              <tbody>
              `;

              for(const account of accountReportPage.values()) {
                html += `
                  <tr class="reduceWeight">
                    <th>${ account.id }</th>
                    <th>${ account.name }</th>
                    <th>
                      <div>
                        ${ account.payments }
                      </div>
                    </th>
                    <th class="text-end">
                      <div>
                        ${ this.reportsUtils.formatAmount(account.usd_balance) }
                      </div>
                    </th>
                    <th class="text-end">
                      <div>${ this.reportsUtils.formatAmount(account.bs_balance) }</div>
                    </th>
                  </tr>
                `;
              }

              html += `
              </tbody>
            </table>

            <div>
              <p class="my-1">
                CANTIDAD DE PAGOS RECIBIDOS: ${ this.report.summary.payments }
              </p>
              <p class="my-1">
                BALANCE TOTAL en USD:
                ${ this.reportsUtils.formatAmount(this.report.summary.total_usd_balance) }
              </p>
              <p class="my-1">
                BALANCE TOTAL en BS:
                ${ this.reportsUtils.formatAmount(this.report.summary.total_bs_balance) }
              </p>
            </div>
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
