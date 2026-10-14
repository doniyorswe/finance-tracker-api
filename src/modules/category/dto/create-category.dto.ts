import { IsNumber, IsOptional, IsString } from 'class-validator';

import { CategoryType } from '../../../common/enums/category.enum.js';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsNumber()
  type: CategoryType;
}
