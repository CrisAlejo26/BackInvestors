import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('weex/v1');

  // Pipe para validaciones generales
  app.useGlobalPipes(
    new ValidationPipe({
      // Elimina los campos que se envian a los post de mas
      whitelist: true,
      // Envia un error al usuario cuando se mandan mas campos de lo normal
      forbidNonWhitelisted: true,
      // Quiero transformar los string a numeros
      // transform: true,
      // transformOptions: {
        // enableImplicitConversion: true
      // }
    }),
  );
  
  await app.listen(3000);
}
bootstrap();
