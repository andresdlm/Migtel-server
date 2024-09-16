import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  Min,
  Max,
  IsNumber,
} from 'class-validator';

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

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  readonly otherRetentions: number;
}

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
