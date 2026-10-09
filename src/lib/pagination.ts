import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Prisma } from '../generated/prisma/client.js';

export class PaginationQueryDto {
  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface Paginated<T> {
  result: T[];
  meta: PaginationMeta;
}

type FindManyArgs<TModel> = Prisma.Args<TModel, 'findMany'>;
type FindManyItem<TModel, TArgs> = Prisma.Result<
  TModel,
  TArgs,
  'findMany'
>[number];

/**
 * Har qanday Prisma modelini sahifalab qaytaradi. `where`, `orderBy`, `select`, `include`
 * oddiy `findMany` dagidek ishlaydi va natija tipi ularga qarab avtomatik chiqadi.
 *
 * @example
 * return paginate(this.prisma.restaurant, query, {
 *   where: { isActive: true },
 *   orderBy: { createdAt: 'desc' },
 * });
 */
export async function paginate<
  TModel,
  TArgs extends Omit<FindManyArgs<TModel>, 'skip' | 'take'>,
>(
  model: TModel,
  { page, limit }: PaginationQueryDto,
  args?: Prisma.Exact<TArgs, Omit<FindManyArgs<TModel>, 'skip' | 'take'>>,
): Promise<Paginated<FindManyItem<TModel, TArgs>>> {
  const delegate = model as unknown as {
    findMany(args: object): Promise<FindManyItem<TModel, TArgs>[]>;
    count(args: object): Promise<number>;
  };
  const where = (args as { where?: unknown } | undefined)?.where;

  const [result, total] = await Promise.all([
    delegate.findMany({
      ...(args as object),
      skip: (page - 1) * limit,
      take: limit,
    }),
    delegate.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);
  return {
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    result,
  };
}
