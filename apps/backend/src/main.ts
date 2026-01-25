import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { GlobalExceptionsFilter } from './common/filters/global.exceptions.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  // 配置 CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://www.tonesc.cn',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Cookie'],
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const error = errors[0];
        const firstConstraint = error.constraints
          ? Object.values(error.constraints)[0]
          : '验证失败';

        throw new BadRequestException(firstConstraint);
      },
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionsFilter());
  let port = Number(process.env.PORT)
  if (isNaN(port) || port < 0 || port > 65535) {
    port = 3001;
  }
  await app.listen(port);
}
bootstrap();
