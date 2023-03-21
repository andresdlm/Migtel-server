import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsPositive,
  IsOptional,
  Min,
  IsNumber,
  Matches,
  IsArray,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoiceProductRelationDto } from './invoice-concept-relation.dtos';
import { CreateInvoiceServiceRelationDto } from './invoice-service-relation.dtos';

export class CreateInvoiceDto {
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
  readonly exhangeRate: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  readonly creditAmount: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  readonly bonusAmount: number;

  @IsString()
  @IsNotEmpty()
  readonly comment: string;

  @IsNotEmpty()
  @Matches(RegExp('USD|EUR|BS'))
  readonly currencyCode: string;

  @IsBoolean()
  @IsOptional()
  readonly paid: boolean;

  @IsNumber()
  @IsNotEmpty()
  readonly userId: number;

  @IsArray()
  readonly products: CreateInvoiceProductRelationDto[];

  @IsArray()
  readonly services: CreateInvoiceServiceRelationDto[];
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
