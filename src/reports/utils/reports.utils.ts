import { Injectable } from '@nestjs/common';
import { PaymentMethodsService } from 'src/payment-methods/services/payment-methods.service';
import { HTML } from '../types/report.type';
import { Payment } from '../models/pdf';

@Injectable()
export class ReportsUtilsService {

  constructor(private paymentMethodsService: PaymentMethodsService) {}

  public getName(invoice: any) {
    if (invoice.client_firstname) {
      return `${invoice.client_firstname} ${invoice.client_lastname}`;
    } else if (invoice.client_company_name) {
      return invoice.client_company_name;
    }

    if (invoice.clientFirstname) {
      return invoice.clientFirstname + ' ' + invoice.clientLastname;
    } else if(invoice.clientCompanyName) {
      return invoice.clientCompanyName;
    }

    if (invoice.clientName) {
      return invoice.clientName;
    } else if(invoice.companyName) {
      return invoice.companyName;
    }
  }

  public formatAmount(value: number) {
    //Split value in miles and decimals
    if(!value.toString().includes('.')) {
      value = Number(value.toString().concat('.00'));
    }

    const stringNumber: string[] = value.toString().split('.');
    const miles: string = stringNumber[0];
    const decimals: string = stringNumber[1];

    //Split miles in 3, starting from the last register and join by dot
    let stringMiles = miles.match(/.{1,3}(?=(.{3})*$)/g)?.join('.');

    //Delete dot aditional after minus
    if (stringMiles?.includes('-')) {
      stringMiles = stringMiles.replace('-.', '-');
    }

    //Define decimals
    let stringDecimals = decimals === undefined ? '00' : decimals?.slice(0, 2);

    //If decimals have 1 digit, complete with 0
    if (stringDecimals.length === 1) {
      stringDecimals = stringDecimals.concat('0');
    }

    //Concat miles and decimals
    return stringMiles?.concat(',', stringDecimals);
  }

  public formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('es-VE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  public getOrganization(salesBookDto: any) {
    const organizations: string[] = [
      '',
      'GUATIRE',
      'CARACAS',
      'HIGUEROTE',
      'GUARENAS',
      'CAUCAGUA',
    ];

    return organizations[salesBookDto.organizationId];
  }

  public getClientType(salesBookDto: any) {
    const clientTypes: string[] = ['', 'RESIDENCIAL', 'EMPRESARIAL'];

    return clientTypes[salesBookDto.clientType];
  }

  public async getPaymentMethodName(salesBookDto?: any) {

    const paymentMethods = await this.paymentMethodsService.findAll({ limit: 1000, offset: 0, getArchive: false })

    const paymentMethod = paymentMethods.find((paymentMethod) => {
      return paymentMethod.id === Number(salesBookDto?.paymentMethod);
    });

    return paymentMethod?.name.toLocaleUpperCase();
  }

  public returnUSD(payment: Payment): number {
    if (payment.currencyCode === 'BS') {
      return payment.amount / payment.exhangeRate;
    } else {
      return payment.amount;
    }
  }

  public returnBs(payment: Payment): number {
    if (payment.currencyCode === 'USD') {
      return payment.amount * payment.exhangeRate;
    } else {
      return payment.amount;
    }
  }

  public splice(report: any, amount: number = 40): Map<number, any[]> {
    const invoiceReportPages: Map<number, any[]> = new Map<number, any[]>();

    //Create pages
    let pageNumber: number = 1;
    while (report.report.length > 0) {
      console.log(`page: ${pageNumber}`);
      const invoices: any[] = report.report.splice(0, amount);
      invoiceReportPages.set(pageNumber, invoices);
      pageNumber++;
    }

    return invoiceReportPages;
  }

  public getStyles(): HTML {
    let css: HTML = `
    <style>
      * {
        box-sizing: border-box;
      }

      .page {
        page-break-after: always;
      }

      .report {
        font-family: system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue","Noto Sans","Liberation Sans",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
        overflow-x: auto;
      }

      .table {
        --bs-table-color-type: initial;
        --bs-table-bg-type: initial;
        --bs-table-color-state: initial;
        --bs-table-bg-state: initial;
        --bs-table-color: #000;
        --bs-table-bg: #fff;
        --bs-table-accent-bg: transparent;
        --bs-table-striped-color: #000;
        --bs-table-striped-bg: rgba(var(--bs-emphasis-color-rgb), .05);
        --bs-table-active-color: #000;
        --bs-table-active-bg: rgba(var(--bs-emphasis-color-rgb), .1);
        --bs-table-hover-color: #000;
        --bs-table-hover-bg: rgba(var(--bs-emphasis-color-rgb), .075);
        --bs-table-border-color: #dee2e6;
        width: 100%;
        margin-bottom: 1rem;
        vertical-align: top;
        border-color: var(--bs-table-border-color);
        caption-side: bottom;
        border-collapse: collapse;
      }

      th {
        display: table-cell;
        text-align: -webkit-match-parent;
        unicode-bidi: isolate;
      }

      .table>thead {
        vertical-align: bottom;
        background-color: #fafafa;
      }

      .table>tbody {
        vertical-align: inherit;
      }

      .table tbody>tr>th, .table tfoot>tr>th, .table thead>tr>td, .table tbody>tr>td, .table tfoot>tr>td {
        vertical-align: top;
        border-top: .7px solid #ddd;
      }

      .table>:not(caption)>*>* {
        padding: .5rem;
        color: var(--bs-table-color-state, var(--bs-table-color-type, var(--bs-table-color)));
        background-color: var(--bs-table-bg);
        border-bottom-width: var(--bs-border-width);
        box-shadow: inset 0 0 0 9999px var(--bs-table-bg-state, var(--bs-table-bg-type, var(--bs-table-accent-bg)));
      }

      .fontSize-table {
        font-size: 0.6em;
      }

      .border-3 {
        border-width: 3px;
      }

      .border-dark {
        --bs-border-opacity: 1;
        border-color: rgba(var(--bs-dark-rgb), var(--bs-border-opacity));
      }

      .w-100 {
        width: 100%;
      }

      .mt-2 {
        margin-top:0.5rem;
      }

      .mt-4 {
        margin-top: 1.5rem;
      }

      .d-flex {
        display: flex;
      }

      .flex-column {
        flex-direction: column;
      }

      .justify-content-between {
        justify-content: space-between;
      }

      .fontSize-header {
        font-size: .8em;
      }

      .text-center {
        text-align: center;
      }

      .text-end {
        text-align: right;
      }

      .text-start {
        text-align: left;
      }

      .reduce-font-weight, .reduceWeight, .reduce-font-weight th, .reduceWeight th, .reduceFontWeight, .reduceFontWeight th {
        font-weight: normal;
      }

      .text-truncate {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      @media print {
        @page {
          margin: 1cm;
        }
      }
    </style>
    `;

    return css;
  }
}
