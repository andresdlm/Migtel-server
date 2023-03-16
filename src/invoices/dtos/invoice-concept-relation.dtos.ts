import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateInvoiceProductRelationDto {
  @IsPositive()
  @IsNotEmpty()
  readonly invoiceId: number;

  @IsPositive()
  @IsNotEmpty()
  readonly productId: number;

  @IsString()
  @IsNotEmpty()
  readonly productName: string;

  @IsPositive()
  @IsNotEmpty()
  readonly count: number;

  @IsPositive()
  @IsNotEmpty()
  readonly price: number;
}
