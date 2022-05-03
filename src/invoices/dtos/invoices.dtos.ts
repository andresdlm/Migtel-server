/* eslint-disable prettier/prettier */
import { IsInt, IsString, IsNotEmpty, IsDate, IsBoolean } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class CreateInvoiceDto {
  @IsInt()
  @IsNotEmpty()
  readonly invoice_number: number;

  @IsInt()
  @IsNotEmpty()
  readonly clientId: number;

  @IsDate()
  @IsNotEmpty()
  readonly register_date: Date;

  @IsInt()
  @IsNotEmpty()
  readonly group: number;

  @IsInt()
  @IsNotEmpty()
  readonly coc: number;

  @IsInt()
  @IsNotEmpty()
  readonly subtotal: number;

  @IsInt()
  @IsNotEmpty()
  readonly iva: number;

  @IsInt()
  @IsNotEmpty()
  readonly iva_r: number;

  @IsInt()
  @IsNotEmpty()
  readonly iva_p: number;

  @IsInt()
  @IsNotEmpty()
  readonly islr: number;

  @IsInt()
  @IsNotEmpty()
  readonly igtf: number;

  @IsInt()
  @IsNotEmpty()
  readonly total_amount: number;

  @IsInt()
  @IsNotEmpty()
  readonly exhange_rate: number;

  @IsString()
  @IsNotEmpty()
  readonly comment: string;

  @IsBoolean()
  @IsNotEmpty()
  readonly canceled: boolean;
}

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {}
