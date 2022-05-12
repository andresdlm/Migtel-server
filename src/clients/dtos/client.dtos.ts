import { IsInt, IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateClientDto {
  @IsInt()
  @IsNotEmpty()
  readonly id: number;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly personType: string;

  @IsString()
  @IsNotEmpty()
  readonly document: string;

  @IsString()
  @IsNotEmpty()
  readonly address: string;

  @IsString()
  @IsNotEmpty()
  readonly city: string;

  @IsInt()
  @IsNotEmpty()
  readonly retention: number;

  @IsBoolean()
  @IsNotEmpty()
  readonly hasIslr: boolean;

  @IsInt()
  @IsNotEmpty()
  readonly amountIslr: number;
}

export class UpdateClientDto extends PartialType(CreateClientDto) {}
