import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InversorAuth } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [

    ConfigModule,

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
        // console.log(configService.get('JWT_SECRET'));
        return {
          // Treamos la variable de entorno
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            // Tiempo de expiracion del token
            expiresIn: '2h'
          }
        }
      }
    })
    
  ],
  // Exportamos la configuracion que importamos para crear las tablas
  exports: [ TypeOrmModule, JwtStrategy, PassportModule, JwtModule ]
})
export class AuthModule {}
