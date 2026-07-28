import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve uploaded files as static assets
  app.useStaticAssets(path.join(process.cwd(), 'uploads'), { prefix: '/uploads' });

  // Global API prefix
  app.setGlobalPrefix('api');

  // CORS — supports comma-separated origins e.g. "http://localhost:3001,http://localhost:3002"
  const rawOrigin = process.env.CORS_ORIGIN ?? '*';
  const corsOrigins = rawOrigin === '*' ? '*' : rawOrigin.split(',').map(o => o.trim());
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Swagger configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('RAL Connect API')
    .setDescription(
      `## RAL Connect — Senior Care Facility Management Platform

**Modules:**
- **Auth** – JWT login / register
- **Users** – Admin user management, activity tracking, approval
- **Facilities** – Listings, availability tracking, flagging, admin controls
- **Partners (Vendors)** – Preferred partner directory with category limits
- **Matching Engine** – Algorithmic inquiry-to-facility matching with manual override
- **Inquiries** – Family care inquiry lifecycle management
- **Notifications** – Internal alert system (new inquiry, inactivity, signup)
- **CMS** – Blogs, guidance articles, directory content
- **Reports** – Aggregated dashboard analytics
- **Admin Config** – Category limits, matching weights, platform settings

All protected endpoints require a **Bearer JWT** token obtained from \`POST /api/auth/login\`.`,
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Paste your JWT token here',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  // Seed default admin on first run
  const authService = app.get(AuthService);
  await authService.seedAdmin();

  const configService = app.get(ConfigService);
  const port = process.env.PORT ?? configService.get<number>('port') ?? 3000;

  await app.listen(port);

  const baseUrl = `http://localhost:${port}`;
  console.log(`\n🚀 RAL Connect Server is running at: ${baseUrl}`);
  console.log(`📚 Swagger Docs: ${baseUrl}/api/docs\n`);
}
bootstrap();
