import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service.js';
import { RestaurantCreateDto } from './restaurant-create.dto.js';
import { PaginationQueryDto } from '../../lib/pagination.js';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  async getRestaurants(@Query() query: PaginationQueryDto) {
    return this.restaurantService.getRestaurants(query);
  }

  @Post()
  @HttpCode(201)
  async createRestaurant(@Body() dto: RestaurantCreateDto) {
    return this.restaurantService.createRestaurant(dto);
  }

  @Get(':id')
  async getRestaurant(@Param('id') id: string) {
    return this.restaurantService.getRestaurantById(id);
  }
}
