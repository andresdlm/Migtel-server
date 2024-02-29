import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class SingleSMSDTO {
  @IsNotEmpty()
  @IsString()
  to: string;

  @IsNotEmpty()
  @IsString()
  text: string;
}

export class MassSMSDTO {
  @IsNotEmpty()
  @IsArray()
  readonly to: string[];

  @IsNotEmpty()
  @IsString()
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
