import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class SingleSMSDTO {
  @IsNotEmpty()
  @IsString()
  to: string;

  @IsNotEmpty()
  @IsString()
  text: string;
}

export class MassSMSDTO {
  @IsNotEmpty()
  @IsArray()
  readonly to: string[];

  @IsNotEmpty()
  @IsString()
  readonly text: string;
}
