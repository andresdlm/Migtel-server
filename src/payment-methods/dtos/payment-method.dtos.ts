import { IsInt, IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreatePaymentMethodDto {
  @IsInt()
  @IsNotEmpty()
  readonly id: number;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsInt()
  @IsNotEmpty()
  readonly coc: number;

  @IsBoolean()
  @IsNotEmpty()
  readonly hasIgtf: boolean;
}

export class UpdatePaymentMethodDto extends PartialType(
  CreatePaymentMethodDto,
) {}
