import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsPositive,
  IsOptional,
  Min,
  IsNumber,
  Matches,
  Max,
  ValidateNested,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class CreateCRMPaymentDTO {
  @IsNotEmpty()
  @IsInt()
  readonly clientId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly amount: number;

  @IsNotEmpty()
  @IsString()
  readonly currencyCode: string;

  @IsNotEmpty()
  @IsString()
  readonly methodId: string;

  @IsNotEmpty()
  @IsString()
  readonly note: string;

  @IsNotEmpty()
  @IsInt()
  readonly userId: number;

  @ValidateNested({ each: true })
  @Type(() => PaymentAttributeCRMDTO)
  readonly attributes: PaymentAttributeCRMDTO[];
}

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

  @IsNotEmpty()
  @Matches(RegExp('USD|EUR|BS'))
  readonly currencyCode: string;

  @IsNumber()
  @IsNotEmpty()
  readonly userId: number;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateCRMPaymentDTO)
  readonly paymentCrmDto: CreateCRMPaymentDTO;
}

export class UpdatePaymentDTO extends PartialType(CreatePaymentDto) {
  @IsNumber()
  @IsOptional()
  readonly paymentMethodId: number;
}

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

export class PaymentAttributeCRMDTO {
  @IsNotEmpty()
  @IsNumber()
  readonly customAttributeId: number;

  @IsOptional()
  @IsString()
  value: string;
}
