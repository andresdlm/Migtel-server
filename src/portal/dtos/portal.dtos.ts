import { IsBoolean, IsNotEmpty } from "class-validator";

export class UpdateState {
  @IsBoolean()
  @IsNotEmpty()
  active: boolean
}