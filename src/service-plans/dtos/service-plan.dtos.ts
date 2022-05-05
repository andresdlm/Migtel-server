import { IsInt, IsString, IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateServicePlanDto {
  @IsInt()
  @IsNotEmpty()
  readonly id: number;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly invoiceLabel: string;

  @IsString()
  @IsNotEmpty()
  readonly servicePlanType: string;

  @IsInt()
  @IsNotEmpty()
  readonly price: number;
}

export class UpdateServicePlanDto extends PartialType(CreateServicePlanDto) {}
