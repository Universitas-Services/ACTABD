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
      whitelist: true, // Ignora propiedades que no estén definidas en el DTO.
      forbidNonWhitelisted: true, // Lanza un error si se envían propiedades no permitidas.
      transform: true, // Transforma los datos de entrada a sus tipos de DTO (ej. string a number).
    }),
  );
  app.enableCors({
    //origin: 'https://la-url-de-tu-frontend.com', // ❗️ IMPORTANTE: Reemplaza esto con la URL real de tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}

// 👇 Modificación aquí para manejar la promesa
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
