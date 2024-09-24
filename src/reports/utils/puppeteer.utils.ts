import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { HTML } from '../types/report.type';

@Injectable()
export class PuppeteerUtils {
  public async createPdf(
    html: HTML,
    fileName: string = 'invoice.pdf',
  ): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: `/usr/bin/google-chrome`,
      args: [
        `--no-sandbox`,
        `--headless`,
        `--disable-gpu`,
        `--disable-dev-shm-usage`,
      ],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    // await page.emulateMediaType('print');
    // console.log('Creating PDF...');
    const pdf = await page.pdf({
      path: `pdf/${fileName}`,
      format: 'A4',
      landscape: true,
      // timeout: 0, // Puppeteer has a limit timeout, with this param that limit is off
    });
    // console.log('PDF created');
    await browser.close();

    return pdf;
  }
}
