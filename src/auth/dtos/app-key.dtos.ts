import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAppKeyDto {
  @IsString()
  @IsNotEmpty()
  readonly description: string;
}
