/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsPositive } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';


export class CreateServiceClientDto {
  @IsPositive()
  @IsNotEmpty()
  readonly clientId: number;

  @IsPositive()
  @IsNotEmpty()
  readonly servicePlanId: number;
}

export class UpdateServiceClientDto extends PartialType(CreateServiceClientDto) {}
