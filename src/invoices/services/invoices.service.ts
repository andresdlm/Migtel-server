import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isNumber } from 'class-validator';

import { CreateInvoiceDto, FilterInvoiceDto } from '../dtos/invoice.dto';
import { Invoice } from '../entities/invoice.entity';

import { ClientsService } from 'src/clients/services/clients.service';
import { ClientServicesService } from 'src/clients/services/client-services.service';
import { PaymentMethodsService } from 'src/payment-methods/services/payment-methods.service';
import { InvoiceConceptsService } from './invoice-concepts.service';
import { InvoiceConcept } from '../entities/invoice-concept.entity';
import { ClientService } from 'src/clients/entities/client-service.entity';
import { InvoiceServicesService } from './invoice-services.service';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepo: Repository<Invoice>,
    @Inject('DOLAR_API') private dolarApi: any[],
    private clientsService: ClientsService,
    private clientServicesService: ClientServicesService,
    private paymentMethodService: PaymentMethodsService,
    private invoiceConceptsService: InvoiceConceptsService,
    private invoiceServicesService: InvoiceServicesService,
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

  findOne(invoiceNumber: number) {
    const invoice = this.invoiceRepo.findOne({
      where: {
        id: invoiceNumber,
      },
      relations: {
        client: true,
        paymentMethod: true,
        invoiceServices: {
          clientService: {
            servicePlan: true,
          },
        },
        invoiceConceptRelation: {
          invoiceConcept: true,
        },
      },
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice #${invoiceNumber} not found`);
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
        invoiceServices: {
          clientService: {
            servicePlan: true,
          },
        },
        invoiceConceptRelation: {
          invoiceConcept: true,
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
    newInvoice.client = client;

    newInvoice.usdInvoice = data.usdInvoice;
    newInvoice.comment = data.comment;

    const clientServicesArray: ClientService[] = [];
    for await (const clientService of data.clientsServices) {
      await this.clientServicesService
        .findOne(clientService)
        .then((clientService) => {
          clientServicesArray.push(clientService);
          newInvoice.clientServices = clientServicesArray;
          newInvoice.clientServicesCount = data.clientsServicesCount;
        });
    }

    const invoiceConceptArray: InvoiceConcept[] = [];
    for await (const invoiceConceptId of data.invoiceConcept) {
      await this.invoiceConceptsService
        .findOne(invoiceConceptId)
        .then((invoiceConcept) => {
          invoiceConceptArray.push(invoiceConcept);
          newInvoice.invoiceConcepts = invoiceConceptArray;
          newInvoice.invoiceConceptCount = data.invoiceConceptsCount;
        });
    }

    const paymentMethod = await this.paymentMethodService.findOne(
      data.paymentMethodId,
    );
    newInvoice.paymentMethod = paymentMethod;

    newInvoice.invoiceNumber = 0;

    this.calculateInvoiceAmount(newInvoice);

    newInvoice = await this.invoiceRepo.save(newInvoice);
    newInvoice.invoiceNumber = newInvoice.id + 5000; // AQUI VA EL PUNTO DE INICIO DE LAS FACTURAS

    let index = 0;
    for await (const service of data.clientsServices) {
      await this.invoiceServicesService.createRelationInvoice({
        invoiceId: newInvoice.id,
        clientServiceId: service,
        count: data.clientsServicesCount[index],
      });
      index++;
    }

    index = 0;
    for await (const concept of data.invoiceConcept) {
      await this.invoiceConceptsService.createRelationInvoice({
        invoiceId: newInvoice.id,
        invoiceConceptId: concept,
        count: data.invoiceConceptsCount[index],
      });
      index++;
    }

    return this.invoiceRepo.save(newInvoice);
  }

  async getPreview(data: CreateInvoiceDto) {
    const preInvoice = this.invoiceRepo.create();
    const client = await this.clientsService.findOne(data.clientId);
    preInvoice.client = client;

    preInvoice.usdInvoice = data.usdInvoice;

    const clientServicesArray: ClientService[] = [];
    for await (const clientService of data.clientsServices) {
      await this.clientServicesService
        .findOne(clientService)
        .then((clientService) => {
          clientServicesArray.push(clientService);
          preInvoice.clientServices = clientServicesArray;
          preInvoice.clientServicesCount = data.clientsServicesCount;
        });
    }

    const invoiceConceptArray: InvoiceConcept[] = [];
    for await (const invoiceConceptId of data.invoiceConcept) {
      await this.invoiceConceptsService
        .findOne(invoiceConceptId)
        .then((invoiceConcept) => {
          invoiceConceptArray.push(invoiceConcept);
          preInvoice.invoiceConcepts = invoiceConceptArray;
          preInvoice.invoiceConceptCount = data.invoiceConceptsCount;
        });
    }

    const paymentMethod = await this.paymentMethodService.findOne(
      data.paymentMethodId,
    );
    preInvoice.paymentMethod = paymentMethod;

    this.calculateInvoiceAmount(preInvoice);
    return preInvoice;
  }

  delete(invoiceNumber: number) {
    return this.invoiceRepo.delete(invoiceNumber);
  }

  async cancelInvoice(invoiceId: number) {
    this.invoiceRepo
      .createQueryBuilder()
      .update(Invoice)
      .set({
        canceled: true,
      })
      .where('id = :id', { id: invoiceId })
      .execute();
  }

  async calculateInvoiceAmount(invoice: Invoice) {
    let amount = 0;
    if (invoice.clientServices) {
      let index = 0;
      invoice.clientServices.forEach((clientService) => {
        amount =
          amount +
          clientService.servicePlan.price * invoice.clientServicesCount[index];
        index++;
      });
    }
    if (invoice.invoiceConcepts) {
      let index = 0;
      invoice.invoiceConcepts.forEach((invoiceConcept) => {
        amount =
          amount + invoiceConcept.price * invoice.invoiceConceptCount[index];
        index++;
      });
    }

    invoice.subtotal = amount;
    invoice.iva = amount * 0.16;
    invoice.iva_r = amount * 0.16 * invoice.client.retention * 0.01;
    invoice.iva_p =
      amount * 0.16 - amount * 0.16 * invoice.client.retention * 0.01;
    invoice.islr = 0;
    invoice.igtf = 0;
    invoice.totalAmount = 0;
    invoice.exhangeRate = this.dolarApi['USD']['sicad2'];

    if (invoice.iva_r == 0) {
      invoice.totalAmount = invoice.subtotal + invoice.iva;
    } else {
      invoice.totalAmount = invoice.subtotal + invoice.iva_p;
    }

    if (invoice.client.hasIslr) {
      invoice.islr = invoice.totalAmount * invoice.client.amountIslr * 0.01;
      invoice.totalAmount = invoice.totalAmount + invoice.islr;
    }

    if (invoice.paymentMethod.hasIgtf) {
      invoice.igtf = invoice.totalAmount * 0.03;
      invoice.totalAmount = invoice.totalAmount + invoice.igtf;
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
