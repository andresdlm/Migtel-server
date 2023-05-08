import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsPositive,
  IsOptional,
  Min,
  IsNumber,
  Matches,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreatePaymentDto {
  @IsInt()
  @IsNotEmpty()
  readonly clientId: number;

  @IsString()
  @IsOptional()
  readonly clientFirstname: string;

  @IsString()
  @IsOptional()
  readonly clientLastname: string;

  @IsString()
  @IsOptional()
  readonly clientCompanyName: string;

  @IsString()
  @IsNotEmpty()
  readonly clientDocument: string;

  @IsString()
  @IsNotEmpty()
  readonly clientAddress: string;

  @IsString()
  @IsNotEmpty()
  readonly paymentMethodCrmId: string;

  @IsNumber()
  @IsNotEmpty()
  readonly amount: number;

  @IsNumber()
  @IsNotEmpty()
  readonly exhangeRate: number;

  @IsString()
  @IsNotEmpty()
  readonly comment: string;

  @IsString()
  @IsNotEmpty()
  readonly period: string;

  @IsNotEmpty()
  @Matches(RegExp('USD|EUR|BS'))
  readonly currencyCode: string;

  @IsNumber()
  @IsNotEmpty()
  readonly userId: number;
}

export class UpdatePaymentDTO extends PartialType(CreatePaymentDto) {}

export class FilterPaymentDto {
  @IsInt()
  @IsOptional()
  @IsPositive()
  limit: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  offset: number;
}
