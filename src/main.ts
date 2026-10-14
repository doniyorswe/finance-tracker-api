import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { SnakeCaseExceptionFilter } from './common/filters/snake-case-exception.filter.js';
import { SnakeCaseInterceptor } from './common/interceptors/snake-case.interceptor.js';
import { NodeEnv } from './config/env.validation.js';
import { setupSwagger } from './config/swagger.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.enableShutdownHooks();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new SnakeCaseInterceptor());
  app.useGlobalFilters(
    new SnakeCaseExceptionFilter(app.get(HttpAdapterHost).httpAdapter),
  );

  const swaggerEnabled =
    config.get<boolean>('SWAGGER_ENABLED') ??
    config.get<NodeEnv>('NODE_ENV') !== NodeEnv.Production;
  if (swaggerEnabled) setupSwagger(app);

  const port = config.get<number>('PORT', 3000);
  await app.listen(port, '0.0.0.0');
}
await bootstrap();
