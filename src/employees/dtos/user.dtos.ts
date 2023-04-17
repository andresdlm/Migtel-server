import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsPositive,
  Min,
  IsBoolean,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Employee } from '../entities/employee.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  readonly role: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  readonly crmId: number;

  @IsNotEmpty()
  readonly employee: Employee;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class FilterUsersDto {
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
