import { IsDate, IsNotEmpty } from 'class-validator';

export class ReportDto {
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
