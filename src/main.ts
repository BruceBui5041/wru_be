import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
  });

  // app.use('/uploads', express.static(join(process.cwd(), 'uploads')));
  app.use(express.urlencoded({ limit: '50mb' }));
  await app.listen(3000);
}
bootstrap();
