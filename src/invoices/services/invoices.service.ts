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
    this.calculateInvoiceAmount(clientId, 'f');
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
    return this.invoiceRepo.save(newInvoice);
  }

  async update(invoiceNumber: number, changes: UpdateInvoiceDto) {
    const invoice = await this.invoiceRepo.findOne(invoiceNumber);
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
    return this.invoiceRepo.save(invoice);
  }

  delete(invoiceNumber: number) {
    return this.invoiceRepo.delete(invoiceNumber);
  }

  async calculateInvoiceAmount(clientId: number, coc: string) {
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
    };
    invoiceAmounts.totalAmount = invoiceAmounts.subtotal + invoiceAmounts.iva;
    if (clientServices[0].client.hasIslr) {
      invoiceAmounts.islr =
        invoiceAmounts.totalAmount +
        invoiceAmounts.totalAmount * clientServices[0].client.amountIslr * 0.01;
      invoiceAmounts.totalAmount = +invoiceAmounts.islr;
    }
    const paymentMethod = await this.paymentMethodService.findOne(coc);
    if (paymentMethod.hasIgtf) {
      invoiceAmounts.igtf = invoiceAmounts.totalAmount * 0.03;
      invoiceAmounts.totalAmount = +invoiceAmounts.igtf;
    }
    console.log(invoiceAmounts);
  }
}
