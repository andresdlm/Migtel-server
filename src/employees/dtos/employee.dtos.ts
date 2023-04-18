import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsInt,
  IsOptional,
  IsPositive,
  Min,
  IsBoolean,
  IsPhoneNumber,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { IsNull } from 'typeorm';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  readonly phone: string;

  @IsString()
  @IsNotEmpty()
  readonly document: string;

  @IsString()
  @IsNotEmpty()
  readonly city: string;

  @IsDateString()
  @IsNotEmpty()
  readonly birthday: string;

  @IsNumber()
  @IsNotEmpty()
  readonly departmentId: number;
}

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}

export class FilterEmployeeDto {
  @IsInt()
  @IsOptional()
  @IsPositive()
  limit: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  offset: number;

  @IsBoolean()
  @IsOptional()
  getActive: boolean;
}
