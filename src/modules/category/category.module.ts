import { Module } from '@nestjs/common';
import { CategoryService } from './category.service.js';
import { CategoryController } from './category.controller.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AuthGuard } from '../auth/auth.guard.js';

@Module({
  controllers: [CategoryController],
  providers: [AuthGuard, CategoryService, PrismaService],
})
export class CategoryModule {}
