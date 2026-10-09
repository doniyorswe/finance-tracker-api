import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { NodeEnv } from './config/env.validation.js';
import { setupSwagger } from './config/swagger.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.enableCors();
  app.enableShutdownHooks();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerEnabled =
    config.get<boolean>('SWAGGER_ENABLED') ??
    config.get<NodeEnv>('NODE_ENV') !== NodeEnv.Production;
  if (swaggerEnabled) setupSwagger(app);

  const port = config.get<number>('PORT', 3000);
  await app.listen(port, '0.0.0.0');
}
await bootstrap();
