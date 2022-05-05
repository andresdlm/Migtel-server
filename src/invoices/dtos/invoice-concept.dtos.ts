/* eslint-disable prettier/prettier */
import { IsInt, IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateInvoiceConceptDto {
  @IsInt()
  @IsNotEmpty()
  readonly invoiceNumber: number;

  @IsInt()
  @IsNotEmpty()
  readonly clientServiceId: number;
}

export class UpdateInvoiceConceptDto extends PartialType(CreateInvoiceConceptDto) {}
