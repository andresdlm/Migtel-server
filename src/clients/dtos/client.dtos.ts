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

export class CreateClientDto {
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
  readonly retention: number;

  @IsBoolean()
  @IsNotEmpty()
  readonly hasIslr: boolean;

  @IsInt()
  @IsNotEmpty()
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
