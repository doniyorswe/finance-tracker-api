import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { toSnakeCase } from '../utils/snake-case.js';

/**
 * Xato javoblari kalitlarini ham snake_case ga o'giradi
 * (`statusCode` -> `status_code`). Guard'lardan otilgan xatolar ham shu yerdan o'tadi.
 */
@Catch()
export class SnakeCaseExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      const response = toSnakeCase(exception.getResponse()) as string | object;
      exception = new HttpException(response, exception.getStatus(), {
        cause: exception,
      });
    }
    super.catch(exception, host);
  }
}
