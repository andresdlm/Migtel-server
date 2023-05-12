import { IsDate, IsNotEmpty, Matches } from 'class-validator';

export class ReportDto {
  @IsDate()
  @IsNotEmpty()
  readonly since: Date;

  @IsDate()
  @IsNotEmpty()
  readonly until: Date;
}

export class PaymentReportDto {
  @Matches(RegExp('USD|BS'))
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
