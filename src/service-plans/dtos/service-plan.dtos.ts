import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateServicePlanDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly invoiceLabel: string;

  @IsString()
  @IsNotEmpty()
  readonly servicePlanType: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly price: number;
}

export class UpdateServicePlanDto extends PartialType(CreateServicePlanDto) {}

export class FilterServicePlanDto {
  @IsInt()
  @IsOptional()
  @IsPositive()
  limit: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  offset: number;
}
