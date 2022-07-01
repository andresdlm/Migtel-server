import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreatePaymentMethodDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsInt()
  @IsNotEmpty()
  readonly coc: number;

  @IsBoolean()
  @IsNotEmpty()
  readonly hasIgtf: boolean;
}

export class UpdatePaymentMethodDto extends PartialType(
  CreatePaymentMethodDto,
) {}

export class FilterPaymentMethodDto {
  @IsInt()
  @IsOptional()
  @IsPositive()
  limit: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  offset: number;
}
