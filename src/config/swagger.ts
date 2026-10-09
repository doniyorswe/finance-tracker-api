import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const SWAGGER_PATH = 'docs';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Uniqr API')
    .setDescription('Uniqr backend API hujjatlari')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();

  // Hujjat har bootstrap'da qayta quriladi, shuning uchun
  // `nest start --watch` qayta ishga tushganda Swagger ham yangilanadi.
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PATH, app, document, {
    jsonDocumentUrl: `${SWAGGER_PATH}/json`,
    swaggerOptions: { persistAuthorization: true },
  });
}
