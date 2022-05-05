/* eslint-disable prettier/prettier */
import { IsInt, IsString, IsNotEmpty, IsDate, IsBoolean } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class CreateInvoiceDto {
  @IsInt()
  @IsNotEmpty()
  readonly invoiceNumber: number;

  @IsInt()
  @IsNotEmpty()
  readonly clientId: number;

  @IsDate()
  @IsNotEmpty()
  readonly registerDate: Date;

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
  readonly totalAmount: number;

  @IsInt()
  @IsNotEmpty()
  readonly exhangeRate: number;

  @IsString()
  @IsNotEmpty()
  readonly comment: string;

  @IsBoolean()
  @IsNotEmpty()
  readonly canceled: boolean;
}

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {}
