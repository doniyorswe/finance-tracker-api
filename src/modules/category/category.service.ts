import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { paginate, PaginationQueryDto } from '../../lib/pagination.js';

const selectCategory = {
  id: true,
  name: true,
  type: true,
  createdAt: true,
} as const;

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCategoryDto: CreateCategoryDto, userId: string) {
    return this.prisma.category.create({
      data: {
        ...createCategoryDto,
        userId,
      },
      select: selectCategory,
    });
  }

  findAll(userId: string, query: PaginationQueryDto) {
    return paginate(this.prisma.category, query, {
      where: {
        userId,
      },
      select: selectCategory,
    });
  }

  async findOne(id: string) {
    return this.prisma.category.findUnique({
      where: {
        id,
      },
      select: selectCategory,
    });
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: {
        id,
      },
      data: updateCategoryDto,
      select: selectCategory,
    });
  }

  remove(id: string) {
    return this.prisma.category.delete({
      where: {
        id,
      },
      select: selectCategory,
    });
  }
}
