import { IsString, IsNotEmpty, IsPositive } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateInvoiceConceptDto {
  @IsString()
  @IsNotEmpty()
  readonly invoiceDescription: string;

  @IsPositive()
  @IsNotEmpty()
  readonly price: number;
}

export class UpdateInvoiceConceptDto extends PartialType(
  CreateInvoiceConceptDto,
) {}
