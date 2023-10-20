import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InversorAuth } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    // Importamos la tabla de User.entity
    TypeOrmModule.forFeature([ InversorAuth ]),

    // Este es el primer paso para la autenticacion del login
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),

    // JWT token
    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: (configService: ConfigService) => {
        // Treamos la variable de entorno
        // console.log(configService.get('JWT_SECRET'));
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2h'
          }
        }
      }
    })

    // JwtModule.register({
    //   secret: '',
    //   signOptions: {
    //     expiresIn: process.env.JWT_SECRET
    //   }
    // })
    
  ],
  // Exportamos la configuracion que importamos para crear las tablas
  exports: [ TypeOrmModule, AuthService ]
})
export class AuthModule {}
