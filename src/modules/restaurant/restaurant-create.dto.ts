import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class RestaurantCreateDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsNumber()
  tableCount: number;

  @IsNumber()
  serviceFee: number;

  @IsString()
  @IsOptional()
  telegramChatId: string;

  @IsBoolean()
  isActive: boolean;
}
