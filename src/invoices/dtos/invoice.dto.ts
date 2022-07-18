import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsPositive,
  IsOptional,
  Min,
  IsArray,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateInvoiceDto {
  @IsInt()
  @IsNotEmpty()
  readonly clientId: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly paymentMethodId: number;

  @IsArray()
  @IsNotEmpty()
  readonly clientsServices: number[];

  @IsArray()
  @IsNotEmpty()
  readonly clientsServicesCount: number[];

  @IsArray()
  @IsNotEmpty()
  readonly invoiceConcepts: number[];

  @IsArray()
  @IsNotEmpty()
  readonly invoiceConceptsCount: number[];

  @IsString()
  @IsNotEmpty()
  readonly comment: string;

  @IsBoolean()
  @IsNotEmpty()
  readonly usdInvoice: boolean;
}

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {}

export class FilterInvoiceDto {
  @IsInt()
  @IsOptional()
  @IsPositive()
  limit: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  offset: number;

  @IsBoolean()
  @IsOptional()
  getCanceled: boolean;
}
