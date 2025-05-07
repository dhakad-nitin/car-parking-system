// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // Create the Nest application

  const config = new DocumentBuilder()
    .setTitle('Car Parking API') // API title
    .setDescription('API for managing car parking lots') // API description
    .setVersion('1.0') // API version
    .build();
  const document = SwaggerModule.createDocument(app, config); // Generate Swagger document
  SwaggerModule.setup('api-docs', app, document); // Set up Swagger at /api-docs

  await app.listen(3000); // Start the server on port 3000
}
bootstrap();