import { Module } from '@nestjs/common';
import { RegisterModule } from './register/register.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InversorRegister } from './register/entities/register.entity';
import { BtcPayModule } from './btc-pay/btc-pay.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { InversorAuth } from './auth/entities/user.entity';

@Module({
  imports: [
    
    RegisterModule,
    BtcPayModule,
    AuthModule,
    // habilitar variables de entorno
    ConfigModule.forRoot(),

    // Conexion a base de datos
    TypeOrmModule.forRoot({
      type: process.env.TYPE as any,
      host: process.env.HOST,
      port: +process.env.PORTMYSQL,
      username: process.env.DB_USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      autoLoadEntities: true,
      // Sincronizar los cambios en la tabla o entidades
      synchronize: true,
    }),
  ]
})
export class AppModule {}
