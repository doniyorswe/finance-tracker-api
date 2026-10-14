import { plainToInstance, Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
  validateSync,
} from 'class-validator';

export enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv = NodeEnv.Development;

  @IsInt()
  @Min(1)
  @Max(65535)
  PORT: number = 8000;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  /** Token imzolash kaliti — kamida 32 belgi */
  @IsString()
  @MinLength(32)
  JWT_SECRET: string;

  /** Token muddati: 15m, 12h, 1d, 7d ... */
  @IsString()
  JWT_EXPIRES_IN: string = '1d';

  /** Berilmasa: production'da o'chiq, boshqa muhitlarda yoqiq */
  @IsOptional()
  @Transform(({ value }) =>
    value === undefined ? undefined : value === true || value === 'true',
  )
  @IsBoolean()
  SWAGGER_ENABLED?: boolean;
}

export function validateEnv(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validated, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(`Env validatsiyasi xato:\n${errors.toString()}`);
  }
  return validated;
}
