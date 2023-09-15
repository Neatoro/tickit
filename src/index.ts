import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { resolve } from 'path';
import * as hbs from 'hbs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.useStaticAssets(resolve(__dirname, 'rendering', 'public'));
  app.setBaseViewsDir(resolve(__dirname, 'rendering', 'views'));
  app.setViewEngine('hbs');
  hbs.registerPartials(resolve(__dirname, 'rendering', 'partials'));

  const configService = app.get(ConfigService);
  const port = configService.get('port') || 8000;

  await app.listen(port);
}

bootstrap();
