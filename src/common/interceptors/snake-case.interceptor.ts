import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { toSnakeCase } from '../utils/snake-case.js';

/**
 * Barcha JSON javoblar kalitlarini snake_case ga o'giradi,
 * masalan `fullName` -> `full_name`. Xatolar `SnakeCaseExceptionFilter` da.
 */
@Injectable()
export class SnakeCaseInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(map((data) => toSnakeCase(data)));
  }
}
