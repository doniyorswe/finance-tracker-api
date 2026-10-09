import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  /** @example admin@gmail.com */
  @IsEmail()
  email: string;

  /** @example 12345678 */
  @IsString()
  @MinLength(6)
  password: string;
}
