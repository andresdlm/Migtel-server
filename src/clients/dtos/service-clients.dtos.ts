/* eslint-disable prettier/prettier */
import { IsInt, IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateServiceClientDto {
  @IsInt()
  @IsNotEmpty()
  readonly client: number;

  @IsInt()
  @IsNotEmpty()
  readonly servicePlan: number;
}

export class UpdateServiceClientDto extends PartialType(CreateServiceClientDto) {}
