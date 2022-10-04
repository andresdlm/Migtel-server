import { ClientService } from 'src/clients/entities/client-service.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Invoice } from './invoice.entity';

@Entity({ name: 'invoice_services' })
export class InvoiceServices {
  @Column()
  count: number;

  @Column({ type: 'real' })
  price: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.invoiceServices)
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @Column({ name: 'invoice_id', primary: true })
  invoiceId: number;

  @ManyToOne(
    () => ClientService,
    (clientService) => clientService.invoiceServices,
  )
  @JoinColumn({ name: 'client_service_id' })
  clientService: ClientService;

  @Column({ name: 'client_service_id', primary: true })
  clientServiceId: number;
}
