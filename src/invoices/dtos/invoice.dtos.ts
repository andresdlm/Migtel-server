import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateInvoiceDto {
  @IsInt()
  @IsNotEmpty()
  readonly invoiceNumber: number;

  @IsInt()
  @IsNotEmpty()
  readonly clientId: number;

  @IsInt()
  @IsNotEmpty()
  readonly group: number;

  @IsInt()
  @IsNotEmpty()
  readonly paymentMethodId: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly subtotal: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly iva: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly iva_r: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly iva_p: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly islr: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly igtf: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly totalAmount: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly exhangeRate: number;

  @IsString()
  @IsNotEmpty()
  readonly comment: string;

  @IsBoolean()
  @IsNotEmpty()
  readonly usdInvoice: boolean;

  @IsBoolean()
  @IsNotEmpty()
  readonly canceled: boolean;
}

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {}
