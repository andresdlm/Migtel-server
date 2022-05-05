/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsPositive } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';


export class CreateClientServiceDto {
  @IsPositive()
  @IsNotEmpty()
  readonly clientId: number;

  @IsPositive()
  @IsNotEmpty()
  readonly servicePlanId: number;
}

export class UpdateClientServiceDto extends PartialType(CreateClientServiceDto) {}
