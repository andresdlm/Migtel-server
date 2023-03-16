import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isNumber } from 'class-validator';

import { CreateInvoiceDto, FilterInvoiceDto } from '../dtos/invoice.dtos';
import { Invoice } from '../entities/invoice.entity';
import { ClientsService } from 'src/clients/services/clients.service';
import { PaymentMethodsService } from 'src/payment-methods/services/payment-methods.service';
import { ProductsService } from '../../products/services/products.service';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class InvoicesService {
  initialInvoiceNumber = 38060; // NO CAMBIAR;

  constructor(
    @InjectRepository(Invoice)
    private invoiceRepo: Repository<Invoice>,
    private clientsService: ClientsService,
    private paymentMethodService: PaymentMethodsService,
    private productsService: ProductsService,
    private userService: UsersService,
  ) {}

  findAll(params?: FilterInvoiceDto) {
    if (params) {
      const { limit, offset, getCanceled } = params;
      return this.invoiceRepo.find({
        relations: { paymentMethod: true },
        order: { id: 'DESC' },
        take: limit,
        skip: offset,
        where: { canceled: getCanceled },
      });
    }
    return this.invoiceRepo.find({
      relations: ['client', 'paymentMethod'],
      order: { id: 'DESC' },
    });
  }

  findOne(id: number) {
    const invoice = this.invoiceRepo.findOne({
      where: {
        id: id,
      },
      relations: {
        paymentMethod: true,
        invoiceProductRelation: {
          product: true,
        },
        user: true,
      },
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice #${id} not found`);
    }
    return invoice;
  }

  findByClientId(clientId: number, params?: FilterInvoiceDto) {
    const { limit, offset, getCanceled } = params;
    const invoices = this.invoiceRepo.find({
      order: { id: 'DESC' },
      take: limit,
      skip: offset,
      where: {
        clientId: clientId,
        canceled: getCanceled,
      },
      relations: [],
    });
    if (!invoices) {
      throw new NotFoundException(`Client #${clientId} has any invoice`);
    }
    // TODO:
    return invoices;
  }

  getCount(getCanceled: boolean) {
    return this.invoiceRepo.count({
      where: { canceled: getCanceled },
    });
  }

  async search(searchInput: string, getArchive: boolean) {
    if (isNumber(Number(searchInput))) {
      return this.invoiceRepo.find({
        where: [{ invoiceNumber: Number(searchInput), canceled: getArchive }],
        take: 20,
      });
    }
  }

  async getUnprinted(params?: FilterInvoiceDto) {
    const { limit, offset } = params;
    const invoices = await this.invoiceRepo.find({
      order: { invoiceNumber: 'ASC' },
      take: limit,
      skip: offset,
      where: {
        printed: false,
      },
      relations: {
        paymentMethod: true,
        invoiceProductRelation: {
          product: true,
        },
      },
    });
    return invoices;
  }

  getUnprintedCount() {
    return this.invoiceRepo.count({
      where: { printed: false },
    });
  }

  print(invoiceNumber: number) {
    return this.invoiceRepo
      .createQueryBuilder()
      .update(Invoice)
      .set({
        printed: true,
      })
      .where('invoice_number = :invoice_number', {
        invoice_number: invoiceNumber,
      })
      .execute();
  }

  async setPaid(id: number, nextState: { paid: boolean }) {
    return this.invoiceRepo
      .createQueryBuilder()
      .update(Invoice)
      .set({
        paid: nextState.paid,
      })
      .where('id = :id', {
        id: id,
      })
      .execute();
  }

  async printCount(countToPrint: number) {
    const invoicesToPrint = await this.invoiceRepo.find({
      order: { invoiceNumber: 'ASC' },
      take: countToPrint,
      skip: 0,
      where: { printed: false },
    });
    for await (const invoice of invoicesToPrint) {
      await this.print(invoice.invoiceNumber);
    }
  }

  unprint(invoiceNumber: number) {
    this.invoiceRepo
      .createQueryBuilder()
      .update(Invoice)
      .set({
        printed: false,
      })
      .where('invoice_number = :invoice_number', {
        invoice_number: invoiceNumber,
      })
      .execute();
  }

  async create(data: CreateInvoiceDto) {
    let newInvoice = this.invoiceRepo.create(data);

    const user = await this.userService.findOne(data.userId);
    newInvoice.user = user;
    const paymentMethod = await this.paymentMethodService.findOne(
      data.paymentMethodId,
    );
    newInvoice.paymentMethod = paymentMethod;

    newInvoice.invoiceNumber = 0;

    this.calculateInvoiceAmount(newInvoice, data);

    newInvoice = await this.invoiceRepo.save(newInvoice);
    newInvoice.invoiceNumber = newInvoice.id + this.initialInvoiceNumber;

    for await (const product of data.products) {
      await this.productsService.createRelationInvoice(product);
    }

    return this.invoiceRepo.save(newInvoice);
  }

  async getPreview(data: CreateInvoiceDto) {
    const preInvoice = this.invoiceRepo.create(data);

    const paymentMethod = await this.paymentMethodService.findOne(
      data.paymentMethodId,
    );
    preInvoice.paymentMethod = paymentMethod;

    this.calculateInvoiceAmount(preInvoice, data);
    return preInvoice;
  }

  async cancelInvoice(invoiceId: number) {
    const invoice = await this.findOne(invoiceId);
    if (invoice.type === 'FACT') {
      await this.invoiceRepo
        .createQueryBuilder()
        .update(Invoice)
        .set({
          canceled: true,
        })
        .where('id = :id', { id: invoiceId })
        .execute();
      const invoiceCanceled = await this.findOne(invoiceId);
      let creditNote = this.invoiceRepo.create(invoiceCanceled);
      creditNote.comment = invoice.invoiceNumber.toString();
      creditNote.igtf = -invoiceCanceled.igtf;
      creditNote.islr = -invoiceCanceled.islr;
      creditNote.iva = -invoiceCanceled.iva;
      creditNote.iva_p = -invoiceCanceled.iva_p;
      creditNote.iva_r = -invoiceCanceled.iva_r;
      creditNote.subtotal = -invoiceCanceled.subtotal;
      creditNote.totalAmount = -invoiceCanceled.totalAmount;
      creditNote.type = 'N/C';
      creditNote.invoiceNumber = 0;

      creditNote = await this.invoiceRepo.save(creditNote);
      creditNote.invoiceNumber = creditNote.id + this.initialInvoiceNumber;
      creditNote = await this.invoiceRepo.save(creditNote);
    }
  }

  async calculateInvoiceAmount(invoice: Invoice, data: CreateInvoiceDto) {
    let amount = 0;

    const client = await this.clientsService.findOne(data.clientId);

    data.products.forEach((product) => {
      amount = amount + product.price * product.count;
    });

    invoice.subtotal =
      amount + ((data.bonusAmount - data.creditAmount) * 100) / 116;
    invoice.iva = invoice.subtotal * 0.16;
    if (client) {
      invoice.iva_r = invoice.iva * client.retention * 0.01;
    } else {
      invoice.iva_r = 0;
    }
    invoice.iva_p = invoice.iva - invoice.iva_r;
    invoice.islr = 0;
    invoice.igtf = 0;

    invoice.totalAmount = invoice.subtotal + invoice.iva;

    if (client && client.amountIslr > 0)
      invoice.islr = invoice.totalAmount * client.amountIslr * 0.01;
    else invoice.islr = 0;

    if (invoice.paymentMethod.hasIgtf && invoice.currencyCode !== 'USD') {
      if (client && client.retention !== 0) {
        invoice.igtf =
          (invoice.totalAmount - invoice.iva + invoice.iva_p - invoice.islr) *
          0.03;
        invoice.totalAmount = invoice.totalAmount + invoice.igtf;
      } else {
        invoice.igtf = invoice.totalAmount * 0.03;
        invoice.totalAmount = invoice.totalAmount + invoice.igtf;
      }
    }

    if (invoice.currencyCode !== 'USD') {
      invoice.subtotal = invoice.subtotal * invoice.exhangeRate;
      invoice.iva = invoice.iva * invoice.exhangeRate;
      invoice.iva_r = invoice.iva_r * invoice.exhangeRate;
      invoice.iva_p = invoice.iva_p * invoice.exhangeRate;
      invoice.islr = invoice.islr * invoice.exhangeRate;
      invoice.igtf = invoice.igtf * invoice.exhangeRate;
      invoice.totalAmount = invoice.totalAmount * invoice.exhangeRate;
    }
  }
}
