import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsPositive,
  IsOptional,
  Min,
  IsArray,
  IsNumber,
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
  readonly invoiceConcept: number[];

  @IsArray()
  @IsNotEmpty()
  readonly invoiceConceptsCount: number[];

  @IsString()
  @IsNotEmpty()
  readonly comment: string;

  @IsBoolean()
  @IsNotEmpty()
  readonly usdInvoice: boolean;

  @IsNumber()
  @IsOptional()
  readonly exhangeRate: number;

  @IsNumber()
  @IsNotEmpty()
  readonly userId: number;

  @IsBoolean()
  @IsOptional()
  readonly paid: boolean;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  readonly creditAmount: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  readonly bonusAmount: number;
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
