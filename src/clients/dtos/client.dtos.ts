import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  Min,
  Max,
  IsNumber,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateClientDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly id: number;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  readonly retention: number;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  readonly amountIslr: number;
}

export class UpdateClientDto extends PartialType(CreateClientDto) {}

export class FilterClientDto {
  @IsInt()
  @IsOptional()
  @IsPositive()
  limit: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  offset: number;
}
