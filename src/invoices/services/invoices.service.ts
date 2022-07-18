import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
        relations: ['client', 'clientsServices', 'paymentMethod'],
        order: { id: 'DESC' },
        take: limit,
        skip: offset,
        where: { canceled: getCanceled },
      });
    }
    return this.invoiceRepo.find({
      relations: ['client', 'clientsServices', 'paymentMethod'],
      order: { id: 'DESC' },
    });
  }

  findOne(invoiceNumber: number) {
    const invoice = this.invoiceRepo.findOne(invoiceNumber, {
      relations: ['client', 'paymentMethod'],
      join: {
        alias: 'invoice',
        leftJoinAndSelect: {
          invoiceServices: 'invoice.invoiceServices',
          clientServices: 'invoiceServices.clientService',
          servicePlan: 'clientServices.servicePlan',
          invoiceConceptRelation: 'invoice.invoiceConceptRelation',
          invoiceConcept: 'invoiceConceptRelation.invoiceConcept',
        },
      },
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice #${invoiceNumber} not found`);
    }
    return invoice;
  }

  findByClientId(clientId: number) {
    const invoices = this.invoiceRepo.find({
      where: {
        clientId: clientId,
      },
      relations: ['client', 'clientsServices', 'paymentMethod'],
    });
    if (!invoices) {
      throw new NotFoundException(`Client #${clientId} has any invoice`);
    }
    // TODO:
    return invoices;
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
    for await (const invoiceConceptId of data.invoiceConcepts) {
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
    for await (const concept of data.invoiceConcepts) {
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
    for await (const invoiceConceptId of data.invoiceConcepts) {
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
    const changes = {
      canceled: true,
    };
    const invoice = await this.invoiceRepo.findOne(invoiceId);
    this.invoiceRepo.merge(invoice, changes);
    return this.invoiceRepo.save(invoice);
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
