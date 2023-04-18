import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsPositive,
  Min,
  IsNumber,
} from 'class-validator';

export class CreateDepartmentDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly deparmentId: number;

  @IsString()
  @IsNotEmpty()
  readonly name: string;
}

export class FilterDepartmentDto {
  @IsInt()
  @IsOptional()
  @IsPositive()
  limit: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  offset: number;
}

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {}
