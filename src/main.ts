import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    credentials: true,
    origin: [
      process.env.FRONT_URL as string,
      `http://localhost:${process.env.FRONT_PORT || 3000}`,
    ],
    // process.env.NODE_ENV === 'prod'
    //   ? '*' // process.env.FRON_URL as string
    //   : `http://localhost:${process.env.FRONT_PORT || 3000}`,
  });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Anthologia')
    .setDescription('API documentation for Anthologia.')
    .setVersion('2.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  await app.listen(process.env.BACK_PORT || 8080);
}
bootstrap();
