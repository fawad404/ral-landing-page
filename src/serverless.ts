import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

// Serverless entry (Vercel). Mirrors main.ts minus static uploads, Swagger and
// the app.listen() call. The Nest app is created once per warm instance.
let cached: Promise<any> | null = null;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');

  const rawOrigin = process.env.CORS_ORIGIN ?? '*';
  const corsOrigins = rawOrigin === '*' ? '*' : rawOrigin.split(',').map(o => o.trim());
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.init();
  return app.getHttpAdapter().getInstance();
}

export function getApp() {
  if (!cached) {
    cached = bootstrap().catch((err) => {
      cached = null;
      throw err;
    });
  }
  return cached;
}
