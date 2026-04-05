import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  // Configurar CORS - Permitir múltiples orígenes incluyendo dominios personalizados
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'https://proyecto-tienda-ropa.vercel.app',
    'https://tienda-frontend-6mrw.onrender.com',
    'https://tienda.christophervaldivia.me',
    'https://proyecto-tienda-ropa-production.up.railway.app',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS policy violation'), false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(port);
  console.log(`🚀 Backend API running on: http://localhost:${port}`);
  console.log(`📝 Available endpoints:`);
  console.log(`   GET  http://localhost:${port}/products`);
  console.log(`   POST http://localhost:${port}/products`);
  console.log(`   GET  http://localhost:${port}/products/:id`);
}

void bootstrap();
