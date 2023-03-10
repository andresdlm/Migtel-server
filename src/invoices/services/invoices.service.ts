import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isNumber } from 'class-validator';

import { CreateInvoiceDto, FilterInvoiceDto } from '../dtos/invoice.dtos';
import { Invoice } from '../entities/invoice.entity';

import { ClientsService } from 'src/clients/services/clients.service';
import { PaymentMethodsService } from 'src/payment-methods/services/payment-methods.service';
import { ProductsService } from '../../products/services/products.service';
import { Product } from '../../products/entities/product.entity';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class InvoicesService {
  initialInvoiceNumber = 38060; // NO CAMBIAR;

  constructor(
    @InjectRepository(Invoice)
    private invoiceRepo: Repository<Invoice>,
    @Inject('DOLAR_API') private dolarApi: any[],
    private clientsService: ClientsService,
    private paymentMethodService: PaymentMethodsService,
    private productsService: ProductsService,
    private userService: UsersService,
  ) {}

  findAll(params?: FilterInvoiceDto) {
    if (params) {
      const { limit, offset, getCanceled } = params;
      return this.invoiceRepo.find({
        relations: ['client', 'paymentMethod'],
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
        client: true,
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
        relations: {
          client: true,
        },
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
        client: true,
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
    let newInvoice = this.invoiceRepo.create();
    const client = await this.clientsService.findOne(data.clientId);
    const user = await this.userService.findOne(data.userId);

    newInvoice.client = client;
    newInvoice.user = user;
    newInvoice.usdInvoice = data.usdInvoice;
    newInvoice.comment = data.comment;
    newInvoice.paid = data.paid;
    newInvoice.creditAmount = data.creditAmount;
    newInvoice.bonusAmount = data.bonusAmount;

    const invoiceConceptArray: Product[] = [];
    for await (const invoiceConceptId of data.invoiceConcept) {
      await this.productsService
        .findOne(invoiceConceptId)
        .then((invoiceConcept) => {
          invoiceConceptArray.push(invoiceConcept);
          newInvoice.products = invoiceConceptArray;
          newInvoice.productsCount = data.invoiceConceptsCount;
        });
    }

    const paymentMethod = await this.paymentMethodService.findOne(
      data.paymentMethodId,
    );
    newInvoice.paymentMethod = paymentMethod;

    newInvoice.invoiceNumber = 0;

    if (data.exhangeRate) {
      newInvoice.exhangeRate = data.exhangeRate;
    } else {
      newInvoice.exhangeRate = this.dolarApi['USD']['sicad2'];
    }

    this.calculateInvoiceAmount(newInvoice, data);

    newInvoice = await this.invoiceRepo.save(newInvoice);
    newInvoice.invoiceNumber = newInvoice.id + this.initialInvoiceNumber; // AQUI VA EL PUNTO DE INICIO DE LAS FACTURAS

    let index = 0;

    index = 0;
    // for await (const conceptId of data.invoiceConcept) {
    //   const concept = await this.productsService.findOne(conceptId);
    //   await this.productsService.createRelationInvoice({
    //     invoiceId: newInvoice.id,
    //     invoiceConceptId: conceptId,
    //     count: data.invoiceConceptsCount[index],
    //     price: concept.price,
    //   });
    //   index++;
    // }

    return this.invoiceRepo.save(newInvoice);
  }

  async getPreview(data: CreateInvoiceDto) {
    const preInvoice = this.invoiceRepo.create();
    const client = await this.clientsService.findOne(data.clientId);
    preInvoice.client = client;
    preInvoice.creditAmount = data.creditAmount;
    preInvoice.bonusAmount = data.bonusAmount;

    preInvoice.usdInvoice = data.usdInvoice;

    const invoiceConceptArray: Product[] = [];
    for await (const invoiceConceptId of data.invoiceConcept) {
      await this.productsService
        .findOne(invoiceConceptId)
        .then((invoiceConcept) => {
          invoiceConceptArray.push(invoiceConcept);
          preInvoice.products = invoiceConceptArray;
          preInvoice.productsCount = data.invoiceConceptsCount;
        });
    }

    const paymentMethod = await this.paymentMethodService.findOne(
      data.paymentMethodId,
    );
    preInvoice.paymentMethod = paymentMethod;

    if (data.exhangeRate) {
      preInvoice.exhangeRate = data.exhangeRate;
    } else {
      preInvoice.exhangeRate = this.dolarApi['USD']['sicad2'];
    }

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
      let creditNote = this.invoiceRepo.create();
      creditNote.client = invoiceCanceled.client;
      creditNote.clientId = invoiceCanceled.clientId;
      creditNote.comment = invoice.invoiceNumber.toString();
      creditNote.exhangeRate = invoiceCanceled.exhangeRate;
      creditNote.igtf = -invoiceCanceled.igtf;
      creditNote.islr = -invoiceCanceled.islr;
      creditNote.iva = -invoiceCanceled.iva;
      creditNote.iva_p = -invoiceCanceled.iva_p;
      creditNote.iva_r = -invoiceCanceled.iva_r;
      creditNote.paymentMethod = invoiceCanceled.paymentMethod;
      creditNote.paymentMethodId = invoiceCanceled.paymentMethodId;
      creditNote.subtotal = -invoiceCanceled.subtotal;
      creditNote.totalAmount = -invoiceCanceled.totalAmount;
      creditNote.type = 'N/C';
      creditNote.usdInvoice = invoiceCanceled.usdInvoice;
      creditNote.invoiceNumber = 0;

      creditNote = await this.invoiceRepo.save(creditNote);
      creditNote.invoiceNumber = creditNote.id + this.initialInvoiceNumber;
      creditNote = await this.invoiceRepo.save(creditNote);
    }
  }

  async calculateInvoiceAmount(invoice: Invoice, data: CreateInvoiceDto) {
    let amount = 0;
    if (invoice.products) {
      let index = 0;
      invoice.products.forEach((product) => {
        amount = amount + product.price * invoice.productsCount[index];
        index++;
      });
    }

    invoice.subtotal =
      amount + ((data.bonusAmount - data.creditAmount) * 100) / 116;
    invoice.iva = invoice.subtotal * 0.16;
    invoice.iva_r = invoice.iva * invoice.client.retention * 0.01;
    invoice.iva_p = invoice.iva - invoice.iva_r;
    invoice.islr = 0;
    invoice.igtf = 0;

    invoice.totalAmount = invoice.subtotal + invoice.iva;

    if (invoice.client.amountIslr > 0) {
      invoice.islr = invoice.totalAmount * invoice.client.amountIslr * 0.01;
    }

    if (invoice.paymentMethod.hasIgtf && invoice.usdInvoice) {
      if (invoice.client.retention === 0) {
        invoice.igtf = invoice.totalAmount * 0.03;
        invoice.totalAmount = invoice.totalAmount + invoice.igtf;
      } else {
        invoice.igtf =
          (invoice.totalAmount - invoice.iva + invoice.iva_p - invoice.islr) *
          0.03;
        invoice.totalAmount = invoice.totalAmount + invoice.igtf;
      }
    }

    if (!invoice.usdInvoice) {
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
