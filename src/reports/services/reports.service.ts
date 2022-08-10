import { Injectable } from '@nestjs/common';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

import { ReportsLogicService } from './reports-logic.service';
import { SalesBookDto } from '../dtos/salesBook.dto';
import { Invoice } from 'src/invoices/entities/invoice.entity';

@Injectable()
export class ReportsService {
  tableFontSize = 8;
  constructor(private reportsLogicService: ReportsLogicService) {}

  async generateSalesBookPDF(params: SalesBookDto): Promise<Buffer> {
    const invoices = await this.reportsLogicService.generateSalesBook(params);
    const content = await this.generateSalesBookTable(params, invoices);
    const totals = this.generateSummary(invoices);
    const pdfdefinition: any = {
      pageOrientation: 'landscape',
      header: function (currentPage, pageCount) {
        return {
          margin: [0, 25, 40, 0],
          text: [
            {
              text: `PÁGINA NRO. ${currentPage} DE ${pageCount}`,
              fontSize: 10,
              bold: true,
            },
          ],
          alignment: 'right',
        };
      },
      content: [
        {
          text: '--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------',
          fontSize: 10,
          bold: true,
          margin: [0, 0, 0, 0],
        },
        {
          text: 'EMPRESA: COMUNICACIONES MIGTEL C. A.',
          fontSize: 10,
          bold: true,
          margin: [0, 0, 0, 0],
        },
        {
          text: 'LIBRO DE VENTAS',
          fontSize: 10,
          bold: true,
          margin: [0, 0, 0, 0],
        },
        {
          // auto-sized columns have their widths based on their content
          text: `DEL ${params.since.toLocaleDateString()} AL ${params.until.toLocaleDateString()}`,
          fontSize: 10,
          bold: true,
          margin: [0, 0, 0, 0],
        },
        {
          text: '--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------',
          fontSize: 10,
          bold: true,
          margin: [0, 0, 0, 0],
        },
        {
          style: 'tableExample',
          table: {
            widths: [45, 19, 33, 30, 162, 50, 48, 39, 48, 40, 40, 31],
            headerRows: 1,
            body: content,
          },
          layout: 'headerLineOnly',
        },
        {
          text: '--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------',
          fontSize: 10,
          bold: true,
          margin: [0, 0, 0, 0],
        },
        {
          columns: [
            {
              width: 70,
              text: `EMITIDAS: ${totals.count}`,
              fontSize: this.tableFontSize,
            },
            {
              width: 70,
              text: `ANULADAS: ${totals.totalCanceled}`,
              fontSize: this.tableFontSize,
            },
            {
              width: 70,
              text: `VÁLIDAS: ${totals.totalValid}`,
              fontSize: this.tableFontSize,
            },
            {
              width: '*',
              text: `TOTALES:`,
              fontSize: this.tableFontSize,
            },
            {
              width: 48,
              text: `${totals.totalBaseImponible.toFixed(2)}`,
              fontSize: this.tableFontSize,
              alignment: 'right',
            },
            {
              width: 55,
              text: `${totals.totalIva.toFixed(2)}`,
              fontSize: this.tableFontSize,
              alignment: 'right',
            },
            {
              width: 64,
              text: `${totals.totalTotalAmount.toFixed(2)}`,
              fontSize: this.tableFontSize,
              alignment: 'right',
            },
            {
              width: 56,
              text: `${totals.totalIvaRet.toFixed(2)}`,
              fontSize: this.tableFontSize,
              alignment: 'right',
            },
            {
              width: 57,
              text: `${totals.totalIvaPer.toFixed(2)}`,
              fontSize: this.tableFontSize,
              alignment: 'right',
            },
            {
              width: 47,
              text: `${totals.totalIgtf.toFixed(2)}`,
              fontSize: this.tableFontSize,
              alignment: 'right',
            },
          ],
        },
      ],
    };

    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = pdfMake.createPdf(pdfdefinition);

      doc.getBuffer((buffer) => {
        resolve(buffer);
      });
    });

    return pdfBuffer;
  }

  async generateSalesBookTable(params: SalesBookDto, invoices: Invoice[]) {
    const content = [];
    content.push([
      { text: 'FECHA', fontSize: this.tableFontSize },
      { text: 'TIPO', fontSize: this.tableFontSize },
      { text: 'NÚMERO', fontSize: this.tableFontSize },
      { text: 'FACT AFEC', fontSize: this.tableFontSize },
      { text: 'NOMBRE O RAZON SOCIAL', fontSize: this.tableFontSize },
      { text: 'RIF/CI', fontSize: this.tableFontSize },
      { text: 'VALOR', fontSize: this.tableFontSize, alignment: 'center' },
      { text: 'IVA', fontSize: this.tableFontSize, alignment: 'center' },
      {
        text: 'TOTAL FACT.',
        fontSize: this.tableFontSize,
        alignment: 'center',
      },
      {
        text: 'IVA RETENIDO',
        fontSize: this.tableFontSize,
        alignment: 'center',
      },
      {
        text: 'IVA PERCIBIDO',
        fontSize: this.tableFontSize,
        alignment: 'center',
      },
      { text: 'IGTF', fontSize: this.tableFontSize, alignment: 'center' },
    ]);
    invoices.forEach((invoice) => {
      if (invoice.usdInvoice) {
        content.push([
          { text: `${invoice.registerDate}`, fontSize: this.tableFontSize },
          { text: `FACT`, fontSize: this.tableFontSize },
          { text: `${invoice.invoiceNumber}`, fontSize: this.tableFontSize },
          { text: ``, fontSize: this.tableFontSize },
          {
            text: `${invoice.client.name.slice(0, 35).toUpperCase()}`,
            fontSize: this.tableFontSize,
          },
          {
            text: `${invoice.client.personType}-${invoice.client.document}`,
            fontSize: this.tableFontSize,
          },
          {
            text: `${(invoice.subtotal * invoice.exhangeRate).toFixed(2)}`,
            fontSize: this.tableFontSize,
            alignment: 'right',
          },
          {
            text: `${(invoice.iva * invoice.exhangeRate).toFixed(2)}`,
            fontSize: this.tableFontSize,
            alignment: 'right',
          },
          {
            text: `${(invoice.totalAmount * invoice.exhangeRate).toFixed(2)}`,
            fontSize: this.tableFontSize,
            alignment: 'right',
          },
          {
            text: `${(invoice.iva_r * invoice.exhangeRate).toFixed(2)}`,
            fontSize: this.tableFontSize,
            alignment: 'right',
          },
          {
            text: `${(invoice.iva_p * invoice.exhangeRate).toFixed(2)}`,
            fontSize: this.tableFontSize,
            alignment: 'right',
          },
          {
            text: `${(invoice.igtf * invoice.exhangeRate).toFixed(2)}`,
            fontSize: this.tableFontSize,
            alignment: 'right',
          },
        ]);
      } else {
        content.push([
          { text: `${invoice.registerDate}`, fontSize: this.tableFontSize },
          { text: `FACT`, fontSize: this.tableFontSize },
          { text: `${invoice.invoiceNumber}`, fontSize: this.tableFontSize },
          { text: ``, fontSize: this.tableFontSize },
          {
            text: `${invoice.client.name.slice(0, 35).toUpperCase()}`,
            fontSize: this.tableFontSize,
          },
          {
            text: `${invoice.client.personType}-${invoice.client.document}`,
            fontSize: this.tableFontSize,
          },
          {
            text: `${invoice.subtotal.toFixed(2)}`,
            fontSize: this.tableFontSize,
            alignment: 'right',
          },
          {
            text: `${invoice.iva.toFixed(2)}`,
            fontSize: this.tableFontSize,
            alignment: 'right',
          },
          {
            text: `${invoice.totalAmount.toFixed(2)}`,
            fontSize: this.tableFontSize,
            alignment: 'right',
          },
          {
            text: `${invoice.iva_r.toFixed(2)}`,
            fontSize: this.tableFontSize,
            alignment: 'right',
          },
          {
            text: `${invoice.iva_p.toFixed(2)}`,
            fontSize: this.tableFontSize,
            alignment: 'right',
          },
          {
            text: `${invoice.igtf.toFixed(2)}`,
            fontSize: this.tableFontSize,
            alignment: 'right',
          },
        ]);
      }
    });
    return content;
  }

  generateSummary(invoices: Invoice[]) {
    let totalBaseImponible = 0;
    let totalIva = 0;
    let totalTotalAmount = 0;
    let totalIvaRet = 0;
    let totalIvaPer = 0;
    let totalIgtf = 0;
    let totalCanceled = 0;
    let totalValid = 0;
    invoices.forEach((invoice) => {
      totalBaseImponible = totalBaseImponible + invoice.subtotal;
      totalIva = totalIva + invoice.iva;
      totalTotalAmount = totalTotalAmount + invoice.totalAmount;
      totalIvaRet = totalIvaRet + invoice.iva_r;
      totalIvaPer = totalIvaPer + invoice.iva_p;
      totalIgtf = totalIgtf + invoice.igtf;
      if (invoice.canceled) {
        totalCanceled++;
      } else {
        totalValid++;
      }
    });
    return {
      totalBaseImponible: totalBaseImponible,
      totalIva: totalIva,
      totalTotalAmount: totalTotalAmount,
      totalIvaRet: totalIvaRet,
      totalIvaPer: totalIvaPer,
      totalIgtf: totalIgtf,
      count: invoices.length,
      totalCanceled: totalCanceled,
      totalValid: totalValid,
    };
  }
}
