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
  ValidateNested,
  Max,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateInvoiceProductRelationDto } from './invoice-product-relation.dtos';
import { CreateInvoiceServiceRelationDto } from './invoice-service-relation.dtos';
import { PartialType } from '@nestjs/mapped-types';

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

  @IsDate()
  @IsOptional()
  readonly paymentDate: Date;

  @IsString()
  @IsNotEmpty()
  readonly paymentMethodCrmId: string;

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
  @Matches(RegExp('USD|BS'))
  readonly currencyCode: string;

  @IsBoolean()
  @IsOptional()
  readonly paid: boolean;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(2)
  readonly clientType: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  readonly organizationId: number;

  @IsString()
  @IsOptional()
  readonly bankReference: string;

  @IsNumber()
  @IsNotEmpty()
  readonly userId: number;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceProductRelationDto)
  readonly productsDtos: CreateInvoiceProductRelationDto[];

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceServiceRelationDto)
  readonly servicesDtos: CreateInvoiceServiceRelationDto[];
}

export class UpdateInvoiceDto {
  @IsOptional()
  @IsNumber()
  readonly paymentMethodId: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  readonly retention: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  readonly islr: number;
}

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

export class UpdateInvoiceProductRelationDto extends PartialType(
  CreateInvoiceProductRelationDto,
) {}

export class UpdateInvoiceServiceRelationDto extends PartialType(
  CreateInvoiceServiceRelationDto,
) {}
