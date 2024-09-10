import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isNumber } from 'class-validator';
import * as https from 'https';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Observer } from 'rxjs';

import {
  CreateInvoiceDto,
  FilterInvoiceDto,
  UpdateInvoiceDto,
  UpdateInvoiceProductRelationDto,
  UpdateInvoiceServiceRelationDto,
} from '../dtos/invoice.dtos';
import { Invoice } from '../entities/invoice.entity';
import { ClientsService } from 'src/clients/services/clients.service';
import { PaymentMethodsService } from 'src/payment-methods/services/payment-methods.service';
import { UsersService } from 'src/employees/services/users.service';
import { InvoiceServiceRelation } from '../entities/invoice-service-relation.entity';
import { InvoiceProductRelation } from '../entities/invoice-product-relation.entity';
import { NotifyService } from 'src/notify-api/services/notify.service';
import { PaymentRecievedSMSDTO } from 'src/notify-api/dtos/notify.dtos';
import { PaymentsService } from 'src/payments/services/payments.service';
import { CreateCRMPaymentDTO } from 'src/payments/dtos/payment.dtos';
import config from 'src/config';

@Injectable()
export class InvoicesService {
  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    private httpService: HttpService,
    @InjectRepository(Invoice)
    private invoiceRepo: Repository<Invoice>,
    @InjectRepository(InvoiceServiceRelation)
    private invoiceServiceRelRepo: Repository<InvoiceServiceRelation>,
    @InjectRepository(InvoiceProductRelation)
    private invoiceProductRelRepo: Repository<InvoiceProductRelation>,
    private clientsService: ClientsService,
    private paymentMethodService: PaymentMethodsService,
    private userService: UsersService,
    private notifyService: NotifyService,
    private paymentService: PaymentsService,
  ) {}

  async findAll(params?: FilterInvoiceDto) {
    if (params) {
      const { limit, offset } = params;
      return await this.invoiceRepo.find({
        order: { id: 'DESC' },
        take: limit,
        skip: offset,
      });
    }
    return await this.invoiceRepo.find({
      relations: {
        paymentMethod: true,
        services: true,
        products: true,
      },
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const invoice = await this.invoiceRepo.findOne({
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

  async findByClientId(clientId: number, params?: FilterInvoiceDto) {
    const { limit, offset } = params;
    const invoices = await this.invoiceRepo.find({
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

  async getCount() {
    return await this.invoiceRepo.count();
  }

  async search(searchInput: string) {
    if (isNumber(Number(searchInput))) {
      return await this.invoiceRepo.find({
        where: [
          { invoiceNumber: Number(searchInput) },
          { clientId: Number(searchInput) },
        ],
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

  async getUnprintedCount() {
    return await this.invoiceRepo.count({
      where: { printed: false },
    });
  }

  async print(invoiceNumber: number) {
    return await this.invoiceRepo
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

  async setPaid(id: number, paymentCRMDto: CreateCRMPaymentDTO) {
    const invoice = await this.invoiceRepo.findOne({
      where: {
        id: id,
      },
    });
    const index = paymentCRMDto.attributes
      .map((e) => e.customAttributeId)
      .indexOf(22);
    paymentCRMDto.attributes[index].value = invoice.invoiceNumber.toFixed(0);
    const notifyBody: PaymentRecievedSMSDTO = {
      clientId: invoice.clientId,
      amount: Number(invoice.totalAmount.toFixed(2)),
      currency: invoice.currencyCode,
      invoiceNumber: invoice.invoiceNumber,
    };

    await this.paymentService.createCrmPayment(paymentCRMDto).finally(() => {
      return this.notifyService.paymentRecievedSMS(notifyBody).subscribe();
    });

    await this.invoiceRepo
      .createQueryBuilder()
      .update(Invoice)
      .set({
        paid: true,
      })
      .where('invoice_number = :invoice_number', {
        invoice_number: invoice.invoiceNumber,
      })
      .execute();

    return await this.findOne(id);
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

  async unprint(invoiceNumber: number) {
    await this.invoiceRepo
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
    let crmResponse: any = null;
    let newInvoice = this.invoiceRepo.create(data);

    const user = await this.userService.findOne(data.userId);
    newInvoice.user = user;
    const paymentMethod = await this.paymentMethodService.findByCrmId(
      data.paymentMethodCrmId,
    );
    newInvoice.paymentMethodId = paymentMethod.id;
    newInvoice.paymentMethod = paymentMethod;

    newInvoice = await this.calculateInvoiceAmount(newInvoice, data);

    if (newInvoice.paid) {
      crmResponse = await this.paymentService.createCrmPayment(
        data.paymentCRMDto,
      );
    }

    newInvoice = await this.invoiceRepo.save(newInvoice);

    if (newInvoice.paid) {
      const notifyBody: PaymentRecievedSMSDTO = {
        clientId: newInvoice.clientId,
        amount: Number(newInvoice.totalAmount.toFixed(2)),
        currency: newInvoice.currencyCode,
        invoiceNumber: newInvoice.invoiceNumber,
      };

      this.notifyService.paymentRecievedSMS(notifyBody).subscribe();

      const url = new URL(
        `payments/${crmResponse.id}`,
        this.configService.crmUrl,
      );
      const headers = { 'X-Auth-App-Key': this.configService.crmApikey };
      const axiosConfig = {
        headers,
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      };
      const payload = {
        attributes: [
          {
            value: newInvoice.invoiceNumber.toFixed(0),
            customAttributeId: 22,
          },
        ],
      };
      const observer: Observer<any> = {
        next: () => {},
        error: (error) => {
          console.error('UISP unavailable', error);
        },
        complete: () => {},
      };
      this.httpService
        .patch(url.toString(), payload, axiosConfig)
        .subscribe(observer);
    }

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

    return newInvoice;
  }

  async getPreview(data: CreateInvoiceDto) {
    const preInvoice = this.invoiceRepo.create(data);

    const paymentMethod = await this.paymentMethodService.findByCrmId(
      data.paymentMethodCrmId,
    );
    preInvoice.paymentMethod = paymentMethod;

    return await this.calculateInvoiceAmount(preInvoice, data);
  }

  async updateInvoice(id: number, changes: UpdateInvoiceDto) {
    const invoice = await this.invoiceRepo.findOneBy({ id: id });
    if (!invoice) {
      throw new NotFoundException(`Invoice #${id} not found`);
    }

    if (changes.paymentMethodId) {
      this.invoiceRepo.merge(invoice, changes);
      invoice.paymentMethod = await this.paymentMethodService.findOne(
        changes.paymentMethodId,
      );
    }

    if (changes.retention !== undefined && invoice.igtf === 0) {
      invoice.iva_r = invoice.iva * changes.retention * 0.01;
      invoice.iva_p = invoice.iva - invoice.iva_r;
    }

    if (changes.islr !== undefined && invoice.igtf === 0) {
      invoice.islr = invoice.subtotal * changes.islr * 0.01;
    }

    if (changes.otherTaxes !== undefined) {
      invoice.otherTaxes = invoice.subtotal * changes.otherTaxes * 0.01;
    }
    await this.invoiceRepo.save(invoice);
    return await this.findOne(invoice.id);
  }

  async updateReference(id: number, changes: { bankReference: string }) {
    const invoice = await this.invoiceRepo.findOneBy({ id: id });
    if (!invoice) {
      throw new NotFoundException(`Invoice #${id} not found`);
    }

    invoice.bankReference = changes.bankReference;
    await this.invoiceRepo.save(invoice);
    return await this.findOne(invoice.id);
  }

  async updatePeriod(id: number, changes: { period: string }) {
    const invoice = await this.invoiceRepo.findOneBy({ id: id });
    if (!invoice) {
      throw new NotFoundException(`Invoice #${id} not found`);
    }

    invoice.period = changes.period;
    await this.invoiceRepo.save(invoice);
    return await this.findOne(invoice.id);
  }

  async cancelInvoice(id: number) {
    const invoice: Invoice = await this.findOne(id);
    invoice.clientId = 0;
    invoice.clientFirstname = 'ANULADA';
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
    invoice.comment = '';
    invoice.period = '';
    invoice.canceled = true;

    for await (const service of invoice.services) {
      await this.invoiceServiceRelRepo.delete({
        invoiceId: invoice.id,
        serviceId: service.serviceId,
      });
    }

    for await (const product of invoice.products) {
      await this.invoiceProductRelRepo.delete({
        invoiceId: invoice.id,
        productId: product.productId,
      });
    }

    return await this.invoiceRepo.save(invoice);
  }

  async createCreditNote(invoiceId: number) {
    const invoice = await this.findOne(invoiceId);
    if (invoice.type === 'FACT' && !invoice.canceled) {
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
      creditNote.comment = invoice.invoiceNumber.toString();
      creditNote.period = invoice.period;
      creditNote.organizationId = invoice.organizationId;
      creditNote.clientType = invoice.clientType;
      creditNote.currencyCode = invoice.currencyCode;
      creditNote.type = 'N/C';
      creditNote.invoiceNumber = 0;
      creditNote.userId = invoice.userId;

      return await this.invoiceRepo.save(creditNote);
    }
  }

  async updateInvoiceProduct(
    invoiceId: number,
    productId: number,
    changes: UpdateInvoiceProductRelationDto,
  ) {
    const invoice = await this.invoiceRepo.findOneBy({ id: invoiceId });
    if (!invoice) {
      throw new NotFoundException(`Invoice #${invoiceId} not found`);
    }

    if (!invoice.printed) {
      const invoiceProduct = await this.invoiceProductRelRepo.findOne({
        where: {
          invoiceId: invoiceId,
          productId: productId,
        },
      });
      invoiceProduct.productName = changes.productName;
      await this.invoiceProductRelRepo.save(invoiceProduct);
      return await this.findOne(invoiceId);
    } else return invoice;
  }

  async updateInvoiceService(
    invoiceId: number,
    serviceId: number,
    changes: UpdateInvoiceServiceRelationDto,
  ) {
    const invoice = await this.findOne(invoiceId);
    if (!invoice.printed) {
      const invoiceService = await this.invoiceServiceRelRepo.findOne({
        where: {
          invoiceId: invoiceId,
          serviceId: serviceId,
        },
      });
      invoiceService.servicePlanName = changes.servicePlanName;
      await this.invoiceServiceRelRepo.save(invoiceService);
      return await this.findOne(invoiceId);
    } else {
      return invoice;
    }
  }

  async updateInvoiceComment(invoiceId: number, changes: { comment: string }) {
    const invoice = await this.invoiceRepo.findOne({
      where: {
        id: invoiceId,
      },
    });
    invoice.comment = changes.comment;
    await this.invoiceRepo.save(invoice);
    return await this.findOne(invoiceId);
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

    invoice.subtotal = amount;
    invoice.iva = invoice.subtotal * 0.16;
    invoice.iva_r = invoice.iva * client.retention * 0.01;
    invoice.iva_p = invoice.iva - invoice.iva_r;
    invoice.islr = invoice.subtotal * client.amountIslr * 0.01;
    invoice.otherTaxes = invoice.subtotal * client.otherRetentions * 0.01;
    invoice.totalAmount = invoice.subtotal + invoice.iva;

    if (invoice.paymentMethod.hasIgtf && invoice.currencyCode !== 'BS') {
      invoice.igtf =
        (invoice.totalAmount - invoice.iva_r - invoice.islr) * 0.03;
    } else {
      invoice.igtf = 0;
    }

    if (invoice.currencyCode === 'BS') {
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
