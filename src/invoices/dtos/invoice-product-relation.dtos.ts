import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateInvoiceProductRelationDto {
  @IsPositive()
  @IsNotEmpty()
  readonly productId: number;

  @IsString()
  @IsNotEmpty()
  readonly productName: string;

  @IsPositive()
  @IsNotEmpty()
  readonly count: number;

  @IsNumber()
  @IsNotEmpty()
  readonly price: number;
}
