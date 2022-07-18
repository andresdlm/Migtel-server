import {
  IsString,
  IsNotEmpty,
  IsPositive,
  IsInt,
  IsBoolean,
  IsOptional,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateInvoiceConceptDto {
  @IsString()
  @IsNotEmpty()
  readonly invoiceDescription: string;

  @IsPositive()
  @IsNotEmpty()
  readonly price: number;
}

export class UpdateInvoiceConceptDto extends PartialType(
  CreateInvoiceConceptDto,
) {}

export class FilterInvoiceConceptDto {
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
  getArchive: boolean;
}
