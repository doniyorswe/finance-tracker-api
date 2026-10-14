import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { type JwtPayload } from '../auth/auth.types.js';
import { PaginationQueryDto } from '../../lib/pagination.js';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(
    @CurrentUser() user: JwtPayload,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.create(createCategoryDto, user.sub);
  }

  @Get()
  findAll(
    @CurrentUser() user: JwtPayload,
    @Query() pagination: PaginationQueryDto,
  ) {
    return this.categoryService.findAll(user.sub, pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
