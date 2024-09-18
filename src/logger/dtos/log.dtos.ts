import {
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  isJWT,
} from 'class-validator';

export class CreateLogDto {
  @IsString()
  @MaxLength(80)
  @IsNotEmpty()
  readonly endpoint: string;

  @IsString()
  @MaxLength(15)
  @IsNotEmpty()
  readonly httpMethod: string;

  @IsJSON()
  @IsOptional()
  readonly requestBody?: any;

  @IsJSON()
  @IsOptional()
  readonly responseBody?: any;

  @IsJSON()
  @IsOptional()
  readonly jwt?: any;

  @IsString()
  @IsOptional()
  readonly stack?: string;

  constructor(
    endpoint: string,
    httpMethod: string,
    requestBody?: any,
    responseBody?: any,
    jwt?: string,
    stack?: string,
  ) {
    this.endpoint = endpoint;
    this.httpMethod = httpMethod;
    this.requestBody = requestBody;
    this.responseBody = responseBody;
    this.stack = stack;
    if (jwt && isJWT(jwt)) {
      const jwtBody = jwt.split('.')[1];
      const decodedJwtBody = Buffer.from(jwtBody, 'base64').toString('utf8');
      this.jwt = decodedJwtBody;
    }
  }
}

export class FilterLogsDto {
  @IsOptional()
  @IsString()
  readonly endpoint: string;

  @IsOptional()
  @IsString()
  readonly httpMethod: string;

  @IsOptional()
  @IsString()
  readonly severity: string;

  @IsOptional()
  @IsString()
  readonly searchParam: string;
}
