// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Настройка валидации
  app.useGlobalPipes(new ValidationPipe());

  // Инициализация ролей
  const usersService = app.get(UsersService);
  await usersService.initializeRoles();

  // Настройка Swagger
  const config = new DocumentBuilder()
    .setTitle('Риэлторское агентство API')
    .setDescription('API для управления риэлторским агентством Казахстана')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
