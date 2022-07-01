import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsPositive,
  IsOptional,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateInvoiceDto {
  @IsInt()
  @IsNotEmpty()
  readonly clientId: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly group: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly paymentMethodId: number;

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
}
