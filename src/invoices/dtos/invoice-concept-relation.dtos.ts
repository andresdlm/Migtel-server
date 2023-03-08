import { IsNotEmpty, IsPositive } from 'class-validator';

export class CreateInvoiceConceptRelationDto {
  @IsPositive()
  @IsNotEmpty()
  readonly invoiceId: number;

  @IsPositive()
  @IsNotEmpty()
  readonly invoiceConceptId: number;

  @IsPositive()
  @IsNotEmpty()
  readonly count: number;

  @IsPositive()
  @IsNotEmpty()
  readonly price: number;
}
