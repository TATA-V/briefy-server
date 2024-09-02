import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AppDataSource } from 'ormconfig';
import { createInitialAdmin } from './scripts/initialize';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.enableCors({
    origin: process.env.CLIENT_BASE_URL,
    credentials: true,
    exposedHeaders: ['authorization'],
  });
  app.use(cookieParser());
  await AppDataSource.initialize();
  await createInitialAdmin();

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
