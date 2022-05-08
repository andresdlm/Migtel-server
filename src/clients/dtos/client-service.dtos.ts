import { IsBoolean, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateClientServiceDto {
  @IsPositive()
  @IsNotEmpty()
  readonly clientId: number;

  @IsPositive()
  @IsNotEmpty()
  readonly servicePlanId: number;

  @IsBoolean()
  readonly hasIndividualPrice: boolean;

  @IsNumber()
  readonly individualPrice: number;
}

export class UpdateClientServiceDto extends PartialType(
  CreateClientServiceDto,
) {}
