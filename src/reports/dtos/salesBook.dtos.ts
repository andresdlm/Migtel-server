import { IsDate, IsNotEmpty } from 'class-validator';

export class SalesBookDto {
  @IsDate()
  @IsNotEmpty()
  readonly since: Date;

  @IsDate()
  @IsNotEmpty()
  readonly until: Date;
}
