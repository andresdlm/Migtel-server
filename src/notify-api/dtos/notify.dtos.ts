import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { FilterByTags } from './filter.dtos';

export class SingleSMSDTO {
  @IsNotEmpty()
  @IsString()
  to: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(30)
  @MaxLength(160)
  text: string;
}

export class MassSMSDTO {
  @IsNotEmpty()
  @IsArray()
  readonly to: string[];

  @IsNotEmpty()
  @IsString()
  @MinLength(30)
  @MaxLength(160)
  readonly text: string;
}

export class PaymentRecievedSMSDTO {
  @IsNotEmpty()
  @IsInt()
  readonly clientId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly amount: number;

  @IsNotEmpty()
  @IsString()
  readonly currency: string;

  @IsNotEmpty()
  @IsNumber()
  readonly invoiceNumber: number;
}

export class MassByTagDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(30)
  @MaxLength(160)
  readonly text: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FilterByTags)
  readonly filters: FilterByTags;
}

export class SingleEmailDTO {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  subject: string;
}

export class MassEmailDTO {
  @IsString()
  @IsNotEmpty()
  readonly text: string;

  @IsString()
  @IsOptional()
  readonly subject: string;

  @IsDefined()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => FilterByTags)
  readonly filters: FilterByTags;

  @IsOptional()
  readonly callback?: MassEmailCallback;
}

export interface MassEmailCallback {
  buttonText: string;
  link: string;
}
