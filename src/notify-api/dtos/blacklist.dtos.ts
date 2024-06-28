import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength } from "class-validator";


export interface Blacklist {
  id: number;
  clientId: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export class CreateBlacklistDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly clientId: number;

  @IsString()
  @MaxLength(255)
  readonly description: string;
}

export class UpdateBlacklistDto extends PartialType(CreateBlacklistDto) {}
