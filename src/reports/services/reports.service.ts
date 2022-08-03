import { Injectable } from '@nestjs/common';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

import { ReportsLogicService } from './reports-logic.service';
import { SalesBookDto } from '../dtos/salesBook.dto';

@Injectable()
export class ReportsService {
  constructor(private reportsLogicService: ReportsLogicService) {}

  async generateSalesBookPDF(params: SalesBookDto): Promise<Buffer> {
    const content = await this.generateSalesBookTable(params);
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
            widths: [
              'auto',
              'auto',
              'auto',
              40,
              '*',
              'auto',
              'auto',
              'auto',
              'auto',
              40,
              40,
              'auto',
            ],
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

  async generateSalesBookTable(params: SalesBookDto) {
    const invoices = await this.reportsLogicService.generateSalesBook(params);
    const content = [];
    const tableFontSize = 8;
    content.push([
      { text: 'FECHA', fontSize: tableFontSize },
      { text: 'TIPO', fontSize: tableFontSize },
      { text: 'NÚMERO', fontSize: tableFontSize },
      { text: 'FACTURA AFECTADA', fontSize: tableFontSize },
      { text: 'NOMBRE O RAZON SOCIAL', fontSize: tableFontSize },
      { text: 'RIF/CI', fontSize: tableFontSize },
      { text: 'VALOR', fontSize: tableFontSize, alignment: 'center' },
      { text: 'IVA', fontSize: tableFontSize, alignment: 'center' },
      { text: 'TOTAL FACT.', fontSize: tableFontSize, alignment: 'center' },
      { text: 'IVA RETENIDO', fontSize: tableFontSize, alignment: 'center' },
      { text: 'IVA PERCIBIDO', fontSize: tableFontSize, alignment: 'center' },
      { text: 'IGTF', fontSize: tableFontSize, alignment: 'center' },
    ]);
    invoices.forEach((invoice) => {
      if (invoice.usdInvoice) {
        content.push([
          { text: `${invoice.registerDate}`, fontSize: tableFontSize },
          { text: `FACT`, fontSize: tableFontSize },
          { text: `${invoice.invoiceNumber}`, fontSize: tableFontSize },
          { text: ``, fontSize: tableFontSize },
          { text: `${invoice.client.name}`, fontSize: tableFontSize },
          {
            text: `${invoice.client.personType}-${invoice.client.document}`,
            fontSize: tableFontSize,
          },
          {
            text: `${(invoice.subtotal * invoice.exhangeRate).toFixed(2)}`,
            fontSize: tableFontSize,
            alignment: 'right',
          },
          {
            text: `${(invoice.iva * invoice.exhangeRate).toFixed(2)}`,
            fontSize: tableFontSize,
            alignment: 'right',
          },
          {
            text: `${(invoice.totalAmount * invoice.exhangeRate).toFixed(2)}`,
            fontSize: tableFontSize,
            alignment: 'right',
          },
          {
            text: `${(invoice.iva_r * invoice.exhangeRate).toFixed(2)}`,
            fontSize: tableFontSize,
            alignment: 'right',
          },
          {
            text: `${(invoice.iva_p * invoice.exhangeRate).toFixed(2)}`,
            fontSize: tableFontSize,
            alignment: 'right',
          },
          {
            text: `${(invoice.igtf * invoice.exhangeRate).toFixed(2)}`,
            fontSize: tableFontSize,
            alignment: 'right',
          },
        ]);
      } else {
        content.push([
          { text: `${invoice.registerDate}`, fontSize: tableFontSize },
          { text: `FACT`, fontSize: tableFontSize },
          { text: `${invoice.invoiceNumber}`, fontSize: tableFontSize },
          { text: ``, fontSize: tableFontSize },
          { text: `${invoice.client.name}`, fontSize: tableFontSize },
          {
            text: `${invoice.client.personType}-${invoice.client.document}`,
            fontSize: tableFontSize,
          },
          { text: `${invoice.subtotal.toFixed(2)}`, fontSize: tableFontSize },
          { text: `${invoice.iva.toFixed(2)}`, fontSize: tableFontSize },
          {
            text: `${invoice.totalAmount.toFixed(2)}`,
            fontSize: tableFontSize,
          },
          { text: `${invoice.iva_r.toFixed(2)}`, fontSize: tableFontSize },
          { text: `${invoice.iva_p.toFixed(2)}`, fontSize: tableFontSize },
          { text: `${invoice.igtf.toFixed(2)}`, fontSize: tableFontSize },
        ]);
      }
    });
    return content;
  }
}
