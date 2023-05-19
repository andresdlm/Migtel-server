import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isNumber } from 'class-validator';

import { CreateInvoiceDto, FilterInvoiceDto } from '../dtos/invoice.dtos';
import { Invoice } from '../entities/invoice.entity';
import { ClientsService } from 'src/clients/services/clients.service';
import { PaymentMethodsService } from 'src/payment-methods/services/payment-methods.service';
import { UsersService } from 'src/employees/services/users.service';
import { InvoiceServiceRelation } from '../entities/invoice-service-relation.entity';
import { InvoiceProductRelation } from '../entities/invoice-product-relation.entity';

@Injectable()
export class InvoicesService {
  initialInvoiceNumber = 47487; // NO CAMBIAR;

  constructor(
    @InjectRepository(Invoice)
    private invoiceRepo: Repository<Invoice>,
    @InjectRepository(InvoiceServiceRelation)
    private invoiceServiceRelRepo: Repository<InvoiceServiceRelation>,
    @InjectRepository(InvoiceProductRelation)
    private invoiceProductRelRepo: Repository<InvoiceProductRelation>,
    private clientsService: ClientsService,
    private paymentMethodService: PaymentMethodsService,
    private userService: UsersService,
  ) {}

  findAll(params?: FilterInvoiceDto) {
    if (params) {
      const { limit, offset, getCanceled } = params;
      return this.invoiceRepo.find({
        order: { id: 'DESC' },
        take: limit,
        skip: offset,
        where: { canceled: getCanceled },
      });
    }
    return this.invoiceRepo.find({
      relations: {
        paymentMethod: true,
        services: true,
        products: true,
      },
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
        products: {
          product: true,
        },
        services: true,
        user: {
          employee: true,
        },
      },
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice #${id} not found`);
    }
    return invoice;
  }

  findByClientId(clientId: number, params?: FilterInvoiceDto) {
    const { limit, offset } = params;
    const invoices = this.invoiceRepo.find({
      order: { id: 'DESC' },
      take: limit,
      skip: offset,
      where: {
        clientId: clientId,
      },
    });
    if (!invoices) {
      throw new NotFoundException(`Client #${clientId} has any invoice`);
    }
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
        products: {
          product: true,
        },
        services: true,
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

  async setPaid(id: number) {
    const invoice = await this.findOne(id);
    this.invoiceRepo.merge(invoice, { paid: !invoice.paid });
    return await this.invoiceRepo.save(invoice);
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
    const paymentMethod = await this.paymentMethodService.findByCrmId(
      data.paymentMethodCrmId,
    );
    newInvoice.paymentMethodId = paymentMethod.id;
    newInvoice.paymentMethod = paymentMethod;

    newInvoice = await this.calculateInvoiceAmount(newInvoice, data);

    newInvoice.invoiceNumber = 0;
    newInvoice = await this.invoiceRepo.save(newInvoice);
    newInvoice.invoiceNumber = newInvoice.id + this.initialInvoiceNumber;

    for await (const product of data.productsDtos) {
      const invoiceProduct = this.invoiceProductRelRepo.create(product);
      invoiceProduct.invoiceId = newInvoice.id;
      await this.invoiceProductRelRepo.save(invoiceProduct);
    }
    for await (const service of data.servicesDtos) {
      const invoiceService = this.invoiceServiceRelRepo.create(service);
      invoiceService.invoiceId = newInvoice.id;
      await this.invoiceServiceRelRepo.save(invoiceService);
    }

    return this.invoiceRepo.save(newInvoice);
  }

  async getPreview(data: CreateInvoiceDto) {
    const preInvoice = this.invoiceRepo.create(data);

    const paymentMethod = await this.paymentMethodService.findByCrmId(
      data.paymentMethodCrmId,
    );
    preInvoice.paymentMethod = paymentMethod;

    return this.calculateInvoiceAmount(preInvoice, data);
  }

  // TODO
  async cancelInvoice(id: number) {
    const invoice: Invoice = await this.findOne(id);
    invoice.clientId = 0;
    invoice.clientFirstname = 'Anulada';
    invoice.clientLastname = '';
    invoice.clientCompanyName = '';
    invoice.clientDocument = '';
    invoice.clientAddress = '';
    invoice.subtotal = 0;
    invoice.iva = 0;
    invoice.iva_p = 0;
    invoice.iva_r = 0;
    invoice.islr = 0;
    invoice.igtf = 0;
    invoice.totalAmount = 0;
    invoice.bonusAmount = 0;
    invoice.creditAmount = 0;
    invoice.comment = '';
    invoice.period = '';
    invoice.canceled = true;
    return await this.invoiceRepo.save(invoice);
  }

  // async update(id: number, changes: UpdatePaymentMethodDto) {
  //   const paymentMethod = await this.findOne(id);
  //   this.paymentMethodRepo.merge(paymentMethod, changes);
  //   return await this.paymentMethodRepo.save(paymentMethod);
  // }

  async createCreditNote(invoiceId: number) {
    const invoice = await this.findOne(invoiceId);
    if (invoice.type === 'FACT') {
      const creditNote = this.invoiceRepo.create();
      creditNote.clientId = invoice.clientId;
      creditNote.clientFirstname = invoice.clientFirstname;
      creditNote.clientLastname = invoice.clientLastname;
      creditNote.clientCompanyName = invoice.clientCompanyName;
      creditNote.clientDocument = invoice.clientDocument;
      creditNote.clientAddress = invoice.clientAddress;
      creditNote.paymentMethodId = invoice.paymentMethodId;
      creditNote.subtotal = -invoice.subtotal;
      creditNote.iva = -invoice.iva;
      creditNote.iva_r = -invoice.iva_r;
      creditNote.iva_p = -invoice.iva_p;
      creditNote.islr = -invoice.islr;
      creditNote.igtf = -invoice.igtf;
      creditNote.totalAmount = -invoice.totalAmount;
      creditNote.exhangeRate = invoice.exhangeRate;
      creditNote.bonusAmount = -invoice.bonusAmount;
      creditNote.creditAmount = -invoice.creditAmount;
      creditNote.comment = invoice.invoiceNumber.toString();
      creditNote.period = invoice.period;
      creditNote.currencyCode = invoice.currencyCode;
      creditNote.type = 'N/C';
      creditNote.invoiceNumber = 0;
      creditNote.userId = invoice.userId;

      await this.invoiceRepo.save(creditNote);
      creditNote.invoiceNumber = creditNote.id + this.initialInvoiceNumber;
      await this.invoiceRepo.save(creditNote);

      await this.invoiceRepo
        .createQueryBuilder()
        .update(Invoice)
        .set({
          canceled: true,
        })
        .where('id = :id', { id: invoiceId })
        .execute();
    }
  }

  async calculateInvoiceAmount(invoice: Invoice, data: CreateInvoiceDto) {
    let amount = 0;

    const client = await this.clientsService.findOne(data.clientId);

    data.productsDtos.forEach((product) => {
      amount = amount + product.price * product.count;
    });
    data.servicesDtos.forEach((service) => {
      amount = amount + service.price * service.count;
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
      invoice.islr = invoice.subtotal * client.amountIslr * 0.01;
    else invoice.islr = 0;

    if (invoice.paymentMethod.hasIgtf && invoice.currencyCode !== 'BS') {
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

    return invoice;
  }
}
