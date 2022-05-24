import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateInvoiceDto, UpdateInvoiceDto } from '../dtos/invoice.dtos';
import { Invoice } from '../entities/invoice.entity';

import { ClientsService } from 'src/clients/services/clients.service';
import { ClientServicesService } from 'src/clients/services/client-services.service';
import { ClientService } from 'src/clients/entities/client-service.entity';
import { PaymentMethodsService } from 'src/payment-methods/services/payment-methods.service';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepo: Repository<Invoice>,
    private clientsService: ClientsService,
    private clientServicesService: ClientServicesService,
    private paymentMethodService: PaymentMethodsService,
  ) {}

  findAll() {
    return this.invoiceRepo.find({
      relations: ['client', 'clientsServices'],
    });
  }

  findOne(invoiceNumber: number) {
    const invoice = this.invoiceRepo.findOne(invoiceNumber, {
      relations: ['client', 'clientsServices', 'paymentMethod'],
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
      relations: ['client', 'clientsServices'],
    });
    if (!invoices) {
      throw new NotFoundException(`Client #${clientId} has any invoice`);
    }
    // TODO:
    return invoices;
  }

  async create(data: CreateInvoiceDto) {
    const newInvoice = this.invoiceRepo.create(data);
    const client = await this.clientsService.findOne(data.clientId);
    newInvoice.client = client;
    const clientServices = await this.clientServicesService.findByClientId(
      data.clientId,
    );
    newInvoice.clientsServices = clientServices;
    const paymentMethod = await this.paymentMethodService.findOne(
      data.paymentMethodId,
    );
    newInvoice.paymentMethod = paymentMethod;
    const invoiceAmounts = this.calculateInvoiceAmount(
      data.clientId,
      data.paymentMethodId,
      data.usdInvoice,
    );
    newInvoice.subtotal = (await invoiceAmounts).subtotal;
    newInvoice.iva = (await invoiceAmounts).iva;
    newInvoice.iva_r = (await invoiceAmounts).iva_r;
    newInvoice.iva_p = (await invoiceAmounts).iva_p;
    newInvoice.islr = (await invoiceAmounts).islr;
    newInvoice.igtf = (await invoiceAmounts).igtf;
    newInvoice.totalAmount = (await invoiceAmounts).totalAmount;
    newInvoice.exhangeRate = (await invoiceAmounts).exhangeRate;
    return this.invoiceRepo.save(newInvoice);
  }

  async update(invoiceNumber: number, changes: UpdateInvoiceDto) {
    let invoice = await this.invoiceRepo.findOne(invoiceNumber);
    if (changes.clientId) {
      const client = await this.clientsService.findOne(changes.clientId);
      invoice.client = client;
    }
    if (changes.paymentMethodId) {
      const paymentMethod = await this.paymentMethodService.findOne(
        changes.paymentMethodId,
      );
      invoice.paymentMethod = paymentMethod;
    }
    this.invoiceRepo.merge(invoice, changes);
    invoice = this.updateInvoiceAmount(invoice);
    return this.invoiceRepo.save(invoice);
  }

  delete(invoiceNumber: number) {
    return this.invoiceRepo.delete(invoiceNumber);
  }

  async removeServiceByInvoice(invoiceNumber: number, clientServiceId: number) {
    let invoice = await this.invoiceRepo.findOne(invoiceNumber, {
      relations: ['clientsServices'],
    });
    invoice.clientsServices = invoice.clientsServices.filter((item) => {
      return item.id !== clientServiceId;
    });
    invoice = this.updateInvoiceAmount(invoice);
    return this.invoiceRepo.save(invoice);
  }

  async addServiceToInvoice(invoiceNumber: number, clientServiceId: number) {
    let invoice = await this.invoiceRepo.findOne(invoiceNumber, {
      relations: ['clientsServices'],
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice #${invoiceNumber} not found`);
    }
    const clientService = await this.clientServicesService.findOne(
      clientServiceId,
    );
    if (!clientService) {
      throw new NotFoundException(
        `Client Service #${clientServiceId} not found`,
      );
    }
    if (!invoice.clientsServices.find((item) => item.id == clientServiceId)) {
      invoice.clientsServices.push(clientService);
    }
    invoice = this.updateInvoiceAmount(invoice);
    return this.invoiceRepo.save(invoice);
  }

  async calculateInvoiceAmount(
    clientId: number,
    coc: number,
    UsdInvoice: boolean,
  ) {
    const clientServices: ClientService[] =
      await this.clientServicesService.findByClientId(clientId);

    let amount = 0;
    clientServices.forEach((clientService) => {
      if (clientService.hasIndividualPrice) {
        amount = amount + clientService.individualPrice;
      } else {
        amount = amount + clientService.servicePlan.price;
      }
    });

    const invoiceAmounts = {
      subtotal: amount,
      iva: amount * 0.16,
      iva_r: amount * 0.16 * clientServices[0].client.retention * 0.01,
      iva_p:
        amount * 0.16 -
        amount * 0.16 * clientServices[0].client.retention * 0.01,
      islr: 0,
      igtf: 0,
      totalAmount: 0,
      exhangeRate: 4.77,
    };

    if (invoiceAmounts.iva_r == 0) {
      invoiceAmounts.totalAmount = invoiceAmounts.subtotal + invoiceAmounts.iva;
    } else {
      invoiceAmounts.totalAmount =
        invoiceAmounts.subtotal + invoiceAmounts.iva_p;
    }

    if (clientServices[0].client.hasIslr) {
      invoiceAmounts.islr =
        invoiceAmounts.totalAmount * clientServices[0].client.amountIslr * 0.01;
      invoiceAmounts.totalAmount =
        invoiceAmounts.totalAmount + invoiceAmounts.islr;
    }

    const paymentMethod = await this.paymentMethodService.findOne(coc);
    if (paymentMethod.hasIgtf) {
      invoiceAmounts.igtf = invoiceAmounts.totalAmount * 0.03;
      invoiceAmounts.totalAmount =
        invoiceAmounts.totalAmount + invoiceAmounts.igtf;
    }

    if (!UsdInvoice) {
      invoiceAmounts.subtotal =
        invoiceAmounts.subtotal * invoiceAmounts.exhangeRate;
      invoiceAmounts.iva = invoiceAmounts.iva * invoiceAmounts.exhangeRate;
      invoiceAmounts.iva_r = invoiceAmounts.iva_r * invoiceAmounts.exhangeRate;
      invoiceAmounts.iva_p = invoiceAmounts.iva_p * invoiceAmounts.exhangeRate;
      invoiceAmounts.islr = invoiceAmounts.islr * invoiceAmounts.exhangeRate;
      invoiceAmounts.igtf = invoiceAmounts.igtf * invoiceAmounts.exhangeRate;
      invoiceAmounts.totalAmount =
        invoiceAmounts.totalAmount * invoiceAmounts.exhangeRate;
    }

    return invoiceAmounts;
  }

  updateInvoiceAmount(invoice: Invoice) {
    let amount = 0;
    invoice.clientsServices.forEach((clientService) => {
      if (clientService.hasIndividualPrice) {
        amount = amount + clientService.individualPrice;
      } else {
        amount = amount + clientService.servicePlan.price;
      }
    });

    invoice.subtotal = amount;
    invoice.iva = amount * 0.16;
    invoice.iva_r = invoice.iva * invoice.client.retention * 0.01;
    invoice.iva_p = invoice.iva - invoice.iva_r;

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

    return invoice;
  }
}
