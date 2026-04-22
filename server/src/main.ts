import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser'
import { validatorOptions } from './conf/validation';
import { corsOptions } from './conf/cors';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api')

  app.useGlobalPipes(new ValidationPipe(validatorOptions))

  app.use(cookieParser())

  app.enableCors(corsOptions)

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
