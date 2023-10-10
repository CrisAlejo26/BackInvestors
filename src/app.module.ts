import { Module } from '@nestjs/common';
import { RegisterModule } from './register/register.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InversorRegister } from './register/entities/register.entity';

@Module({
  imports: [RegisterModule,
    
    // Conexion a base de datos
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'root',
      password: 'alejo',
      database: 'consolidado_cajeros',
      entities: [InversorRegister],
      // Sincronizar los cambios en la tabla o entidades
      synchronize: true,
    })

  ]
})
export class AppModule {}
