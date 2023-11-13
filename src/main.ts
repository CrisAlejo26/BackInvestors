import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as https from 'https';
import * as fs from 'fs';


async function bootstrap() {

  // const httpsOptions = {
  //   key: fs.readFileSync('./secrets/cert.key'),
  //   cert: fs.readFileSync('./secrets/cert.crt'),
  // };

  // const app = await NestFactory.create(AppModule, { httpsOptions });
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

  app.enableCors();
  // app.use(helmet());

  // app.enableCors({
  //   origin: '*', // o un array de dominios permitidos
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   credentials: true,
  // }); 
  
  await app.listen(process.env.PORT, process.env.HOST_MAIN, () => {
    console.log(`La aplicaci�n se est� ejecutando en:`);
    console.log(`? Local: http://localhost:${process.env.PORT}/`);
    console.log(`? Red: http://${process.env.HOST_MAIN}:${process.env.PORT}/`);
  });
}
bootstrap();
