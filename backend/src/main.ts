import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const API_PORT = process.env.API_PORT || 3001;

  await app.listen(API_PORT);
}

bootstrap();
