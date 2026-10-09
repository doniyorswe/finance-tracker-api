import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RestaurantCreateDto } from './restaurant-create.dto.js';
import { paginate, PaginationQueryDto } from '../../lib/pagination.js';

@Injectable()
export class RestaurantService {
  constructor(private readonly prisma: PrismaService) {}

  async getRestaurants(query: PaginationQueryDto) {
    return paginate(this.prisma.restaurant, query, {
      orderBy: { createdAt: 'desc' },
    });
  }

  async createRestaurant(data: RestaurantCreateDto) {
    const isSlugExists = await this.prisma.restaurant.findUnique({
      where: {
        slug: data.slug,
      },
    });

    if (isSlugExists) {
      throw new BadRequestException('slug_already_exists');
    }
    return await this.prisma.restaurant.create({
      data,
    });
  }

  async getRestaurantById(id: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: {
        id,
      },
    });

    if (!restaurant) {
      throw new BadRequestException('restaurant_not_found');
    }

    return restaurant;
  }
}
