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

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly invoiceDescription: string;

  @IsPositive()
  @IsNotEmpty()
  readonly price: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class FilterProductDto {
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
