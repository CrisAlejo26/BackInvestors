<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Descripcion para Crear autenticación

## 1. Crear un archivo .env para definir variables de entorno.

```bash
.env
```

## 2. Tener configurado el app.Module.ts con las conexiones necesarias, para crear una tabla en una base de datos.

```bash
@Module({

  imports: [

    # habilitar variables de entorno
    ConfigModule.forRoot(),

    # Conexion a base de datos
    TypeOrmModule.forRoot({
      type: process.env.TYPE as any,
      host: process.env.HOST,
      port: +process.env.PORTMYSQL,
      username: process.env.DB_USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      
      # Sincronizar los cambios en la tabla o entidades
      autoLoadEntities: true,
      synchronize: true,
    }),
  ]
})

```

## 3. Crear un Rest Api completo con el comando:

```bash

nest g res auth

```

## 4. Debemos crear la entidad o tabla para la base de datos con los parametros del registro.

Los parametros o atributos que definiremos son los que vamos a pedir al usuario para que se registre,
como por ejemplo nombre, email, password, etc.
Es importante tener en cuenta que el tipo de dato generado en la anotacion @Column('varchar') depende de la base de datos, ademas el tipo de rol que se puede ver en el atributo de roles, su definicion tambien depende de la base de datos.

```bash

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class InversorAuth {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', {
        unique: true
    })
    email: string;

    @Column('varchar', {
        # Nunca va a mostrar la contraseña cuando se haga una peticion de busqueda en base de datos
        select: false
    })
    password: string;

    @Column('varchar')
    fullName: string;

    @Column('bool', {
        default: true
    })
    isActive: boolean;

    # Definiendo roles del login
    @Column({
        type: 'enum',
        enum: ['inversor', 'admin'],
        default: 'inversor'
    })
    roles: 'inversor' | 'admin';

}

```

### Si queremos hacer que un dato tenga la posibilidad que venga vacio o nulo se puede hacer esto (no se lo recomendable):

```bash

@Column('varchar', {
    nullable: true
})
fullName: string;

```

## 5. Seguimos a crear los Dto o las Interfaces para definir los tipos de datos con sus validaciones.

```bash

import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator"

export class CreateAuthDto {

    @IsString()
    @IsEmail()
    readonly email: string

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    # Este se usa de manera personalizada para habilitar caracteres especiales
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
            message: 'The password must have a Uppercase, lowercase letter and a number'
        }
    )
    readonly password: string

    @IsString()
    @MinLength(5)
    readonly fullName: string
}

```

## 6. Creamos el controlador para el registro.

```bash

import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

}

```

## 7. Instalamos bcrypt para encriptar las contraseñas.

```bash

npm i bcrypt

```

## 7. Creamos el servicio para el registro.

```bash

import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateAuthDto } from './dto';
import { Repository } from 'typeorm';
import { InversorAuth } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService')

  constructor(
    @InjectRepository(InversorAuth) 
    private readonly inversorAuthRepository: Repository<InversorAuth>
  ) {}

  async create(createAuthDto: CreateAuthDto) {

    try {
      const { password, ...userData } = createAuthDto;
      const inversor = this.inversorAuthRepository.create({
        ...createAuthDto,
        password: bcrypt.hashSync(password, 10),
      })
      await this.inversorAuthRepository.save(inversor)
      delete inversor.password
      return inversor
    } catch (error) {
      this.handleErrors(error)
    }
  }

    private handleErrors( error: any): never {
    if ( error.code === '23505') throw new BadRequestException(error.detail);
    
    this.logger.error(error);
    throw new InternalServerErrorException('Error al crear el registro');

  }
}

```