import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsBoolean,
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

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly phone: string;

  @IsString()
  @IsNotEmpty()
  readonly personType: string;

  @IsString()
  @IsNotEmpty()
  readonly document: string;

  @IsString()
  @IsNotEmpty()
  readonly address: string;

  @IsString()
  @IsNotEmpty()
  readonly city: string;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  readonly retention: number;

  @IsBoolean()
  @IsNotEmpty()
  readonly hasIslr: boolean;

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

  @IsBoolean()
  @IsOptional()
  getArchive: boolean;
}
