import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateClientServiceDto {
  @IsPositive()
  @IsNotEmpty()
  readonly clientId: number;

  @IsPositive()
  @IsNotEmpty()
  readonly servicePlanId: number;

  @IsBoolean()
  readonly hasIndividualPrice: boolean;

  @IsNumber()
  readonly individualPrice: number;
}

export class UpdateClientServiceDto extends PartialType(
  CreateClientServiceDto,
) {}

export class FilterClientServiceDto {
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
