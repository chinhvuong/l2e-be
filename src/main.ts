import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  // Setup Swagger
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('L2E API')
    .setDescription('The L2E API description')
    .setVersion('1.0')
    .addTag('L2E')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  // Global Validation Custom
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
