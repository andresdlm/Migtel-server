import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class SalesBookReportDto {
  @IsDate()
  @IsNotEmpty()
  readonly since: Date;

  @IsDate()
  @IsNotEmpty()
  readonly until: Date;

  @IsNumber()
  @IsNotEmpty()
  readonly paymentMethod: number;

  @IsNumber()
  @IsNotEmpty()
  readonly organizationId: number;

  @IsNumber()
  @Min(0)
  @Max(2)
  @IsNotEmpty()
  readonly clientType: number;
}

export class ReportDto {
  @IsDate()
  @IsNotEmpty()
  readonly since: Date;

  @IsDate()
  @IsNotEmpty()
  readonly until: Date;
}

export class PaymentReportDto {
  @IsNumber()
  @IsNotEmpty()
  readonly organizationId: number;

  @IsNumber()
  @IsNotEmpty()
  readonly paymentMethod: number;

  @Matches(RegExp('ALL|USD|BS'))
  @IsNotEmpty()
  readonly currencyCode: string;

  @IsDate()
  @IsNotEmpty()
  readonly since: Date;

  @IsDate()
  @IsNotEmpty()
  readonly until: Date;
}

export class AccountReport {
  readonly id: number;
  readonly name: string;
  readonly payments: number;
  readonly balance: number;
}

export class ReferenceDto {
  @IsNumber()
  @IsNotEmpty()
  readonly paymentMethod: number;

  @IsDate()
  @IsNotEmpty()
  readonly since: Date;

  @IsDate()
  @IsNotEmpty()
  readonly until: Date;
}
