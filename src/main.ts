import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { StandardResponseInterceptor } from './common/interceptors/standard-response.interceptor';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors({
    origin: true
  });
  app.setGlobalPrefix('api/v1');
  const port = process.env.PORT || 3000;
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new StandardResponseInterceptor());

  const config = new DocumentBuilder()
    .addServer('api/v1')
    .setTitle('API')
    .setDescription('mungmo API 문서입니다.')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', '인증 관련')
    .addTag('user', '유저 관련')
    .addTag('walk', '산책 관련')
    .addTag('chat', '댕댕닥터 관련 관련')
    .build();

  const document = SwaggerModule.createDocument(app, config, { ignoreGlobalPrefix: true });
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);

  console.log(`listening on port ${port}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
    console.log('hot reload.....');
  }
}
bootstrap();
