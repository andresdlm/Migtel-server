import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class FilterByTags {
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  readonly tags: number[];

  @IsOptional()
  @IsInt()
  @IsIn([1, 2])
  readonly clientType: number;

  @IsOptional()
  @IsString()
  @Matches(RegExp('positive|negative'))
  readonly balance: string;

  @IsOptional()
  @IsBoolean()
  readonly lead: boolean;

  @IsOptional()
  @IsBoolean()
  readonly archived: boolean;

  @IsOptional()
  @IsBoolean()
  readonly suspended: boolean;

  @IsOptional()
  @IsBoolean()
  readonly text: string;
}
