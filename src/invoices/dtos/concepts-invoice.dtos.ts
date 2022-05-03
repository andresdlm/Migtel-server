/* eslint-disable prettier/prettier */
import { IsInt, IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateConceptInvoiceDto {
  @IsInt()
  @IsNotEmpty()
  readonly invoiceInvoiceNumber: number;

  @IsInt()
  @IsNotEmpty()
  readonly serviceClientId: number;
}

export class UpdateConceptInvoiceDto extends PartialType(CreateConceptInvoiceDto) {}
