import { IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  full_name: string;

  @IsString()
  telegram_user_id: string;
}
