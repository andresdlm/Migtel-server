import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateInvoiceServiceRelationDto {
  @IsPositive()
  @IsNotEmpty()
  readonly invoiceId: number;

  @IsPositive()
  @IsNotEmpty()
  readonly serviceId: number;

  @IsPositive()
  @IsNotEmpty()
  readonly servicePlanId: number;

  @IsString()
  @IsNotEmpty()
  readonly serviceName: string;

  @IsPositive()
  @IsNotEmpty()
  readonly count: number;

  @IsPositive()
  @IsNotEmpty()
  readonly price: number;
}
