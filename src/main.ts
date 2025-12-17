// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Universitas ACTABD API')
    .setDescription(
      'Documentación de la API para el sistema de Actas de Entrega.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 👇 CONFIGURACIÓN DE CORS ACTUALIZADA
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'http://localhost:3000',
      'https://dev-actadeentrega.netlify.app',
      'https://dev-panel-admin.netlify.app',
      'https://app.actadeentrega.site',
      'https://admin.actadeentrega.site',
      'https://app.actadeentrega.online',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
