<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Descripcion para Crear autenticación

## Instalaciones necesarias

```bash

npm i bcrypt
npm i axios
npm i class-transformer
npm i class-validator
npm i mysql2
npm i passport
npm i passport-jwt
npm i reflect-metadata
npm i rxjs
npm i typeorm
npm i validation
npm i -D @types/multer

```

## 1. Crear un archivo .env para definir variables de entorno.

```bash
.env
```

## 2. Tener configurado el app.Module.ts con las conexiones necesarias, para crear una tabla en una base de datos.

```ts
@Module({

  imports: [

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
      
      # Sincronizar los cambios en la tabla o entidades
      autoLoadEntities: true,
      synchronize: true,
    }),
  ]
})

```

## 3. Crear un Rest Api completo con el comando:

```npm

nest g res auth

```

## 4. Debemos crear la entidad o tabla para la base de datos con los parametros del registro.

Los parametros o atributos que definiremos son los que vamos a pedir al usuario para que se registre,
como por ejemplo nombre, email, password, etc.
Es importante tener en cuenta que el tipo de dato generado en la anotacion @Column('varchar') depende de la base de datos, ademas el tipo de rol que se puede ver en el atributo de roles, su definicion tambien depende de la base de datos.

```ts

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
        // Nunca va a mostrar la contraseña cuando se haga una peticion de busqueda en base de datos
        select: false
    })
    password: string;

    @Column('varchar')
    fullName: string;

    @Column('bool', {
        default: true
    })
    isActive: boolean;

    // Definiendo roles del login
    @Column({
        type: 'enum',
        enum: ['inversor', 'admin'],
        default: 'inversor'
    })
    roles: 'inversor' | 'admin';

}

```

### Si queremos hacer que un dato tenga la posibilidad que venga vacio o nulo se puede hacer esto (no se lo recomendable):

```ts

@Column('varchar', {
    nullable: true
})
fullName: string;

```

## 5. Seguimos a crear los Dto o las Interfaces para definir los tipos de datos con sus validaciones.

```ts

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

```ts

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

## 7. Creamos el servicio para el registro.

```ts

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

## 8. Importamos la entidad en el modulo auth.module.ts para que cargue la tabla en la base de datos

```ts

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    // Importamos la tabla de User.entity
    TypeOrmModule.forFeature([ InversorAuth ]),
  ]
})

```

# Configuración de JWT token.

## 1. Debemos configurar el JWT en el auth.module.ts dentro del imports.

```ts

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

```

La variable de entorno -----JWT_SECRET----- debe ser un valor aleatorio por ejemplo: 'asdfgsgsadfsadf549852416' la cual solo el desarrollador debe tener conocimiento de ella, todo el modulo debe de quedar de la siguiente manera:

```ts

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
    # Importamos la tabla de User.entity
    TypeOrmModule.forFeature([ InversorAuth ]),

    # Este es el primer paso para la autenticacion del login
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),

    // JWT token
    JwtModule.registerAsync({
      // el ConfigModule y service son modulos que se instalan con una dependencia
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
  # Exportamos la configuracion que importamos para crear las tablas
  exports: [ TypeOrmModule, AuthService ]
})
export class AuthModule {}

```

## 2. Lo que sigue es realizar la configuracion del controlador que va a recibir los intentos de login.

Este controlador se debe configurar con el metodo post, ya que recibe los datos de logueo.

```ts

@Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

```

## 3. Ahora se debe configurar el servicio.

```ts
async login(loginUserDto: LoginUserDto) {

    const { email, password } = loginUserDto;

    // Hacemos una peticion y solo buscamos por una peticion y me trae los datos
    const user = await this.inversorAuthRepository.findOne({ 
      where: { email }, 
      select: { email: true, password: true } });

    if ( !user ) throw new UnauthorizedException("Credenciales no validas (correo electronico)")
    
    // Comparamos la contraseña que no sea igual
    if ( !bcrypt.compareSync(password, user.password) ) {
      throw new UnauthorizedException("Credenciales no validas (contraseña)")
    }

    return user
  }

```

## 4. Ahora creamos un directorio dentro de la carpeta auth que se llame strategies.

```bash

strategies

```

## 5. Dentro del directorio creamos un archivo que se llame jwt.strategy.ts.

```bash

jwt.strategy.ts

```

## 6. Escribimos la configuración inicial.

Creamos una clase con el nombre que queramos darle preferiblemente JwtStrategy, la cual extendemos de PassportStrategy y Strategy, luego usamos un metodo asyncronico el cual va a regresar una promesa del tipo de dato que definimos en la entidad de nuestra base de datos.

```ts

import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { InversorAuth } from "../entities/user.entity";

export class JwtStrategy extends PassportStrategy( Strategy ) {

    async validate( payload: any ): Promise<InversorAuth>{
        
        return;
    }

}

```

## 7. Creamos un directorio que se llame interfaces, dentro del directorio de auth.

```bash

interfaces

```

## 8. Creamos un archivo que se llame jwt.strategy.interface.ts.

```bash

jwt.strategy.interface.ts

```

Dentro del archivo debemos crear una interface con los datos que va a recibir el payload que tenemos como parametro del metodo validate en jwt.strategy.ts

```ts

export interface JwtPayload {

    email:string

    // TODO: añadir todo lo que quieran grabar
}

```

Luego lo importamos en la clase jwt.strategy.ts y desestructuramos el email:

```ts

import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { InversorAuth } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt.strategy.interface";

export class JwtStrategy extends PassportStrategy( Strategy ) {

  async validate( payload: JwtPayload ): Promise<InversorAuth>{
    
    const { email } = payload

    return;
  }

}

```

## 9. Creamos un constructor en nuestra clase jwt.strategy.ts

El contructor va a crear 2 atributos uno traido de la dependencia configService y el otro va a cumplir la funcion de conectarnos a nuestra base de datos, de la siguiente manera:

```ts

import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { InversorAuth } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt.strategy.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";

export class JwtStrategy extends PassportStrategy( Strategy ) {

    constructor(
        @InjectRepository( InversorAuth )
        private readonly inversorAuthRepository: Repository<InversorAuth>,
        private readonly configService: ConfigService
    ){
        super({
            secretOrKey: ''
        })
    }

    async validate( payload: JwtPayload ): Promise<InversorAuth>{
        
        return;
    }

}

```

Despues de crear el contructor, importamos el modulo ConfigModule en el modulo de auth es decir en auth.module.ts:

```ts

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

    // Importamos el modulo para que funcione la clase jwt.strategy.ts
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
  exports: [ TypeOrmModule, AuthService ]
})
export class AuthModule {}


```

Una vez hecho este paso, volvemos a nuestra clase JwtStrategy, para importar la clave secreta que debemos tener definida en nuestras variables de entorno:

```ts

import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { InversorAuth } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt.strategy.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";

export class JwtStrategy extends PassportStrategy( Strategy ) {

    constructor(
        @InjectRepository( InversorAuth )
        private readonly inversorAuthRepository: Repository<InversorAuth>,
        private readonly configService: ConfigService
    ){
        super({
            secretOrKey: configService.get('JWT_SECRET'),
        })
    }

    async validate( payload: JwtPayload ): Promise<InversorAuth>{
        
        return;
    }

}

```

## 10. Luego configuramos el metodo validacion.

El motodo recibe el email de busqueda para encontrarlo en la base de datos, dependiendo si esta activo o no, o si lo encuentra o no, entonces da un error:

```ts

async validate( payload: JwtPayload ): Promise<InversorAuth>{

  const { email } = payload;
  
  const user = await this.inversorAuthRepository.findOneBy({ email });

  if ( !user ) {
    throw new UnauthorizedException('Token invalido')
  }

  if ( !user.isActive ) {
    throw new UnauthorizedException('Usuario inactivo, habla con un administrador')
  }

  return user;
}

```

Una vez hecho y configurado el metodo, entonces usamos la anotacion @Injectable() en la clase para que se use como un servicio

```ts

import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { InversorAuth } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt.strategy.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

    constructor(
        @InjectRepository( InversorAuth )
        private readonly inversorAuthRepository: Repository<InversorAuth>,
        private readonly configService: ConfigService
    ){
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate( payload: JwtPayload ): Promise<InversorAuth>{

        const { email } = payload;
        
        const user = await this.inversorAuthRepository.findOneBy({ email });

        if ( !user ) {
            throw new UnauthorizedException('Token invalido')
        }

        if ( !user.isActive ) {
            throw new UnauthorizedException('Usuario inactivo, habla con un administrador')
        }

        return user;
    }

}

```

Una vez hecho esto, continuamos a importar en los providers de auth.module.ts nuestro servicio que acabamos de crear.

```ts

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
  exports: [ TypeOrmModule, AuthService ]
})
export class AuthModule {}

```

Luego en el mismo modulo vamos a exportar el JwtStrategy, PassportModule, JwtModule para hacer funcionar nuestra estrategia de autenticacion:

```ts

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

```

## 11. Lo que sigue es irnos a auth.service.ts. 

Vamos a crear un metodo que se llame getJwtToken, con un parametro de tipo JwtPayload, el cual definimos en las interfaces

```ts

private getJwtToken(payload: JwtPayload) {
  
}

```

# Luego definimos un nuevo atributo en nuestro constructor, dentro del mismo archivo que se usara con el servicio de JwtService

```ts

constructor(
    @InjectRepository(InversorAuth) 
    private readonly inversorAuthRepository: Repository<InversorAuth>,
    private readonly jwtService: JwtService
  ) {}

```

Una vez configurado nuestro atributo, nos vamos nuevamente a el metodo getJwtToken para definir como crear un token, a traves de nuestro servicio, recordemos que el payload recibe unicamente el correo electronico

```ts

private getJwtToken(payload: JwtPayload) {
  
  const token = this.jwtService.sign( payload );

  return token;
}

```

Ahora lo que haremos es dirigirnos el return del parametro login, el cual se encarga de verificar un usuario dentro de nuestra base de datos, para realizar el login; alli lo que vamos hacer es enviar el email a getJwtToken para verificar el token o comprobarlo.

```ts

async login(loginUserDto: LoginUserDto) {

  const { email, password } = loginUserDto;

  // Hacemos una peticion y solo buscamos por una peticion y me trae los datos
  const user = await this.inversorAuthRepository.findOne({ 
    where: { email }, 
    select: { email: true, password: true } });

  if ( !user ) throw new UnauthorizedException("Credenciales no validas (correo electronico)")
  
  // Comparamos la contraseña que no sea igual
  if ( !bcrypt.compareSync(password, user.password) ) {
    throw new UnauthorizedException("Credenciales no validas (contraseña)")
  }

  return {
    ...user,
    token: this.getJwtToken({ email: user.email })
  }
}

```

Tambien hacemos lo mismo con el metodo create, el cual crea los usuarios, se debe tener cuidado con los nombres de las variables que si sean las correctas

```ts

async create(createAuthDto: CreateAuthDto) {

  try {
    const { password, ...userData } = createAuthDto;
    const inversor = this.inversorAuthRepository.create({
      ...createAuthDto,
      password: bcrypt.hashSync(password, 10),
    })
    await this.inversorAuthRepository.save(inversor)
    delete inversor.password
    return {
      ...inversor,
      token: this.getJwtToken({ email: inversor.email })
    }
  } catch (error) {
    this.handleErrors(error)
  }
}

```

## Ahora podemos hacer pruebas con postman, prueba con un usuario que ya tengas en la base de datos, con el metodo POST, colocando los siguientes parametros:


```url

Url: http://localhost:3000/weex/v1/auth/login

```
## Body => Raw => JSON

```json

{
    "email":"alej8@gmail.com",
    "password":"Eligiendo25"
}

```

La respuesta debe llegar de la siguiente manera si el usuario existe y la contraseña esta bien:

```json

{
    "email": "alej8@gmail.com",
    "password": "$2b$10$KCiQ4AgeBDGMOGn0Jx9dXePsSm4k49Fgg3SjlhMVkNcVaUMhuhHYe",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFsZWo4QGdtYWlsLmNvbSIsImlhdCI6MTY5Nzc5NjYyMSwiZXhwIjoxNjk3ODAzODIxfQ._Nmz5iMZ3IQo9tQdNP0Mt14dmu0eBKimPJDdQPSe7Bk"
}

```

Puedes verificar el token en la pagina oficial de jwt

## Ahora podemos hacer pruebas con postman, para crear un usuario, con el metodo POST:

```url

Url: http://localhost:3000/weex/v1/auth/register

```
## Body => Raw => JSON

```json

{
    "email":"michaelrojas25@gmail.com",
    "fullName":"Michael Rojas",
    "password":"Probando1234567"
}

```

La respuesta debe llegar de la siguiente manera si el usuario existe y la contraseña esta bien:

```json

{
    "email": "michaelrojas25@gmail.com",
    "fullName": "Michael Rojas",
    "id": "07f90d2e-c328-4e67-96c6-05caa84833bd",
    "isActive": true,
    "roles": "inversor",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1pY2hhZWxyb2phczI1QGdtYWlsLmNvbSIsImlhdCI6MTY5Nzc5NzA0OCwiZXhwIjoxNjk3ODA0MjQ4fQ.nxCxM-JvkT7U8EdOGmNgjGo_uJxJQtzeoY2_U4FDT5s"
}

```

## 12. Ahora configuramos la entidad para verificar que el email no tenga espacios

Vamos al archivo de entidad de la base de datos y vamos a generar dos metodos que comprueben que el email no tenga espacios ni mayusculas antes de que se grabe, los elimina o los cambia para evitar errores en la base de datos, esto lo haremos en el archivo user.entity.ts, los metodos son: checkFieldsBeforeInsert, checkFieldsBeforeUpdate.

```ts

import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class InversorAuth {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', {
        unique: true
    })
    email: string;

    @Column('varchar', {
        // Nunca va a mostrar la contraseña cuando se haga una peticion de busqueda en base de datos
        select: false
    })
    password: string;

    @Column('varchar')
    fullName: string;

    @Column('bool', {
        default: true
    })
    isActive: boolean;

    // definiendo roles del login
    @Column({
        type: 'enum',
        enum: ['inversor', 'admin'],
        default: 'inversor'
    })
    roles: 'inversor' | 'admin';

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }

}

```

# Prohibir acceso a una ruta en especifico

Prohibir el acceso a ciertas rutas es super importante para evitar hackeos, por eso vamos a crear una ruta en nuestro controlador para manejarlo de una mejor forma, esto lo haremos en el controlador de auth.controller.ts, para eso usaremos la anotacion @UseGuards().

```ts

@Get('private')
@UseGuards( AuthGuard() )
testingPrivateRoute() {
  
  return {
    ok: true,
    message: 'Hola Mundo Private'
  }
}

```

Ahora puede intentar hacer una peticion **GET** desde postman a la url 'http://localhost:3000/weex/v1/auth/private' y vera que aparecera un error de no autorizado, esto es porque el usuario no tiene permisos para acceder a esta ruta. 
##
Pero si intenta hacer una peticion get con un token de algun usuario que haya creado o logueado, puede funcionar, intentelo en postman con los siguientes datos:

```url

http://localhost:3000/weex/v1/auth/private

```

En la pestaña de authorizacion elija la opcion de 'Bearer Token', luego coloque el tocken del usuario, en mi caso es:

```bash

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFsZWo4QGdtYWlsLmNvbSIsImlhdCI6MTY5Nzc5ODc1MCwiZXhwIjoxNjk3ODA1OTUwfQ.7HM6PTHxTQH6wjamXq25AKL_vA6teH6Hh4yFSXScS7U

```

Luego intente nuevamente la peticion y se dara cuenta que funcionara.

#### Ahora puede intentar ir a la base de datos y en la columna isActive del usuario que selecciono el token, coloquelo en false, recuerde que si esta trabajando en mysql false se interpreta como un 0, e intente nuevamente la peticion.

Le debe de salir este mensaje

```json

{
    "message": "Usuario inactivo, habla con un administrador",
    "error": "Unauthorized",
    "statusCode": 401
}

```

#### Ahora puede intentar cambiar el nombre del correo electronido en la base de datos, del token que selecciono y vuelva a enviar la solicitud, debe de responder esto en postman:

```json

{
    "message": "Token invalido",
    "error": "Unauthorized",
    "statusCode": 401
}

```

# Continuar con JWT Token

Ahora lo que se debe hacer es cambiar en la interface jwt.strategy.interface.ts el email, por id, despues de eso habra que hacer muchos cambios, porque lo que buscamos es el id, no el correo, pues los correos pueden ser repetidos, pero el id siempre es unico, por eso tambien se debe cambiar en el archivo jwt.strategy.ts, y por ultimo los dos metodos en el archivo auth.service.ts dichos archivos deben quedan de la siguiente manejar:

#### jwt.strategy.interface.ts

```ts

export interface JwtPayload {

    id:string

    // TODO: añadir todo lo que quieran grabar
}

```

#### jwt.strategy.ts

```ts

import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { InversorAuth } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt.strategy.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

    constructor(
        @InjectRepository( InversorAuth )
        private readonly inversorAuthRepository: Repository<InversorAuth>,
        private readonly configService: ConfigService
    ){
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate( payload: JwtPayload ): Promise<InversorAuth>{

        const { id } = payload;
        
        const user = await this.inversorAuthRepository.findOneBy({ id });

        if ( !user ) {
            throw new UnauthorizedException('Token invalido')
        }

        if ( !user.isActive ) {
            throw new UnauthorizedException('Usuario inactivo, habla con un administrador')
        }

        return user;
    }

}

```

### auth.service.ts

```ts

  async create(createAuthDto: CreateAuthDto) {

    try {
      const { password, ...userData } = createAuthDto;
      const inversor = this.inversorAuthRepository.create({
        ...createAuthDto,
        password: bcrypt.hashSync(password, 10),
      })
      await this.inversorAuthRepository.save(inversor)
      delete inversor.password
      return {
        ...inversor,
        token: this.getJwtToken({ id: inversor.id })
      }
    } catch (error) {
      this.handleErrors(error)
    }
  }

  async login(loginUserDto: LoginUserDto) {

    const { email, password } = loginUserDto;

    // Hacemos una peticion y solo buscamos por una peticion y me trae los datos
    const user = await this.inversorAuthRepository.findOne({ 
      where: { email }, 
      select: { email: true, password: true} });

    if ( !user ) throw new UnauthorizedException("Credenciales no validas (correo electronico)")
    
    // Comparamos la contraseña que no sea igual
    if ( !bcrypt.compareSync(password, user.password) ) {
      throw new UnauthorizedException("Credenciales no validas (contraseña)")
    }

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    }
  }

```

## Lo siguiente es agregar el parametro id que debe traerse desde mi base de datos para el token, en la linea de findOne(), de lo contrario nos dara un error

```ts
async login(loginUserDto: LoginUserDto) {

    const { email, password } = loginUserDto;

    // Hacemos una peticion y solo buscamos por una peticion y me trae los datos
    const user = await this.inversorAuthRepository.findOne({ 
      where: { email }, 
      select: { email: true, password: true, id: true} });

    if ( !user ) throw new UnauthorizedException("Credenciales no validas (correo electronico)")
    
    // Comparamos la contraseña que no sea igual
    if ( !bcrypt.compareSync(password, user.password) ) {
      throw new UnauthorizedException("Credenciales no validas (contraseña)")
    }

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    }
  }

```

Con esto implementado ahora el token funciona con el id de cada usuario, es decir que lo que usuario para loguear es el id, esto va ayudar a que si ***el correo se actualiza o se cambia***, no va afectar en nada el registro

## Decorador o Custom Property Decorator

Vamos a agregar un nuevo decorador en el constrolador de auth.controller.ts

```ts

@Get('private')
@UseGuards( AuthGuard() )
testingPrivateRoute(
  @Req() request: Express.Request
) {

  console.log({user: request.user});

  return {
    ok: true,
    message: 'Hola Mundo Private',
    user: {name: 'Cristian'}
  }
}

```
Nos daremos cuenta cuando hagamos una peticion a esa url y con el token correcto, que mostrara en consola los datos del usuario.
##
Ahora lo que haremos es crear un directorio en la carpeta auth que se llame ***decorators*** y dentro de la carpeta un archivo que se llame ***get-user.decorator.ts***
##
Dentro de este archivo crearemos un decorador personalizado; para iniciar esto podemos hacer una prueba con el siguiente codigo y colocando el decorador en el metodo ***testingPrivateRoute*** del ***auth.controller.ts***

```ts
// get-user.decorator.ts

import { createParamDecorator } from "@nestjs/common";

export const GetUser = createParamDecorator(
    
    () => {
        return "Hola Mundo"
    }
);

```

```ts

// auth.controller.ts

@Get('private')
@UseGuards( AuthGuard() )
testingPrivateRoute(
  // @Req() request: Express.Request
  @GetUser() user: InversorAuth
) {

  // console.log({user: request.user});
  console.log({ user });

  return {
    ok: true,
    message: 'Hola Mundo Private',
    user: {name: 'Cristian'}
  }
}

```

Cuando hagamos una llamada a esa url, entonces en consola nos aparecera un mensaje como este:

```json

{ user: 'Hola Mundo' }

```

Ahora continuamos con la configuracion de la anotación, usando 2 parametros uno de ellos con data, de la siguiente manera:

```ts

import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const GetUser = createParamDecorator(
    
    ( data, ctx: ExecutionContext ) => {
        console.log({ data });
        return "Hola Mundo"
    }
);

```

Como prueba puede enviar strings en la anotacion asi: @GetUser('probando')

```ts

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    // @Req() request: Express.Request
    @GetUser(['email', 'nombre']) user: InversorAuth,
  ) {

    // console.log({user: request.user});

    return {
      ok: true,
      message: 'Hola Mundo Private',
      user,
    }
  }

}

```

#### Continuamos con la configuracion en nuestra anotacion, lo que sigue es devolver el usuario si el tocken enviado es correcto, sino vamos a decir que el usuario no se encontro

```ts

import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";

export const GetUser = createParamDecorator(
    
    ( data, ctx: ExecutionContext ) => {
        
        const req = ctx.switchToHttp().getRequest();
        const user = req.user;

        if ( !user ) {
            throw new InternalServerErrorException('Usuario no encontrado ( request )')
        }

        return user;
    }
);

```

Por ejemplo podemos hacer la prueba con postman:

#### Hacemos una peticion GET a:

```bash

http://localhost:3000/weex/v1/auth/private

```

#### Ahora en la seccion de Authentication elegimos la opcion de Bearer token, ponemos un token de un usuario ya creado o que tengamos en la base de datos, y la respuesta debe ser asi:

```json

{
    "ok": true,
    "message": "Hola Mundo Private",
    "user": {
        "id": "e7578085-d7b6-4f49-b0e3-c6b1f7338144",
        "email": "michaelrojas23@gmail.com",
        "fullName": "Michael Gonzalez",
        "isActive": true,
        "roles": "inversor"
    }
}

```

#### El siguiente punto es enviar un dato que necesitemos ver a la anotacion que acabamos de crear

```ts

import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";

export const GetUser = createParamDecorator(
    
    ( data: string, ctx: ExecutionContext ) => {
        
        const req = ctx.switchToHttp().getRequest();
        const user = req.user;

        if ( !user ) {
            throw new InternalServerErrorException('Usuario no encontrado ( request )')
        }

        // Si no trae datos entonces muestra todo el usuario, sino entonces muestra el dato que buscamos
        return ( !data ) ? user : user[data];
    }
);

```

Ahora podemos hacer un prueba en el controlador

```ts

@Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    // @Req() request: Express.Request
    @GetUser() user: InversorAuth,
    @GetUser('email') userEmail: InversorAuth,
  ) {

    return {
      ok: true,
      message: 'Hola Mundo Private',
      user,
      userEmail
    }
  }

```

Con esto solo va a traer en la respuesta el email, como tenemos dos anotaciones probablemente cuando se haga una solicitud a la URL del controlador entonces imprime dos respuestas de la siguiente forma en postman:

```json

{
    "ok": true,
    "message": "Hola Mundo Private",
    "user": {
        "id": "e7578085-d7b6-4f49-b0e3-c6b1f7338144",
        "email": "michaelrojas23@gmail.com",
        "fullName": "Michael Gonzalez",
        "isActive": true,
        "roles": "inversor"
    },
    "userEmail": "michaelrojas23@gmail.com"
}

```

#### Lo que sigue es crear un otro decorador que nos trae los dados desde donde nos hacen una peticion GET. 

Para eso crearmos otro archivo que va a tener nuestro decorador, el archivo se va a llamar ***raw-headers.decorator.ts*** copiamos todo el decorador ***get-user.decorator.ts*** en un nuevo archivo llamado ***raw-headers.decorator.ts*** luego cambiamos el nombre de la función por ***RawHeader*** y devolvemos el req.raw-headers.

```ts

import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";

export const RawHeaders = createParamDecorator(
    
    ( data: string, ctx: ExecutionContext ) => {
        
        const req = ctx.switchToHttp().getRequest();
        return req.rawHeaders;
    }
);

```

#### Luego vamos a el auth.controller.ts y usamos el decorador en nuestro metodo, no podemos olvidar agregarlo al return para que se vea en la respuesta.


```ts

@Get('private')
@UseGuards( AuthGuard() )
testingPrivateRoute(
  // @Req() request: Express.Request
  @GetUser() user: InversorAuth,
  @GetUser('email') userEmail: InversorAuth,
  @RawHeaders() rawHeaders: string[],
) {

  return {
    ok: true,
    message: 'Hola Mundo Private',
    user,
    userEmail,
    rawHeaders,
  }
}

```

#### Ahora podemos hacer una prueba con postman con un token correcto, la respuesta que nos debe dar es la siguiente:

```json

{
    "ok": true,
    "message": "Hola Mundo Private",
    "user": {
        "id": "740c8598-5525-4770-a08c-b6bd62a296d4",
        "email": "michael@gmail.com",
        "fullName": "Michael Velazco",
        "isActive": true,
        "roles": "inversor"
    },
    "userEmail": "michael@gmail.com",
    "rawHeaders": [
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc0MGM4NTk4LTU1MjUtNDc3MC1hMDhjLWI2YmQ2MmEyOTZkNCIsImlhdCI6MTY5NzgyOTI4NywiZXhwIjoxNjk3ODM2NDg3fQ.PNL9q11xuHrAeglzuTrVMoNKlpNdWLGXH3X3zPwUqeA",
        "User-Agent",
        "PostmanRuntime/7.33.0",
        "Accept",
        "*/*",
        "Postman-Token",
        "76063ed4-d14a-443c-a960-34c5fcaff7f4",
        "Host",
        "localhost:3000",
        "Accept-Encoding",
        "gzip, deflate, br",
        "Connection",
        "keep-alive"
    ]
}

```

## Definiendo los roles

Ahora vamos a definir el tipo de autenticacion por roles, para eso vamos a crear una nueva ruta en nuestro controlador ***auth.controller.ts***

```ts

  @Get('private2')
  @UseGuards( AuthGuard() )
  privateRoute2(
    @GetUser() user: InversorAuth,
  )
    {
      return {
        ok: true,
        user,
    }
  }

```

Usamos el decorador SetMetada para establecer los roles que seran permitidos:

```ts

@Get('private2')
  @SetMetadata('roles', ['admin', 'inversor'])
  @UseGuards( AuthGuard() )
  privateRoute2(
    @GetUser() user: InversorAuth,
  )
    {
      return {
        ok: true,
        user,
    }
  }

```

Ahora vamos a generar un guard el cual lo vamos a ubicar en el directorio ***auth***, dentro de otro directorio que se llamara ***guards*** y el nombre del archivo es ***userRole***

```bash

nest g gu auth/guards/userRole --no-spec

```

Con esto ya tenemos nuestro guard creado de forma rapida y segura.
###
Ahora lo que sigue es usarlo en nuestro controlador y colocar un console.log para hacer una prueba.

```ts
// user-role.guard.ts

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserRoleGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    console.log('UseGuard');
    return true;
  }
}

```

```ts

// auth.controller.ts

@Get('private2')
  @SetMetadata('roles', ['admin', 'inversor'])
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRoute2(
    @GetUser() user: InversorAuth,
  )
    {
      return {
        ok: true,
        user,
    }
  }

```

Si hacemos una prueba nuevamente desde postman con un token valido hacia esa url, en la consola se mostrara este mensaje

```bash

[Nest] 14436  - 21/10/2023, 11:00:29     LOG [RouterExplorer] Mapped {/weex/v1/auth/login, POST} route +1ms
[Nest] 14436  - 21/10/2023, 11:00:29     LOG [RouterExplorer] Mapped {/weex/v1/auth/private, GET} route +1ms
[Nest] 14436  - 21/10/2023, 11:00:29     LOG [RouterExplorer] Mapped {/weex/v1/auth/private2, GET} route +1ms
[Nest] 14436  - 21/10/2023, 11:00:29     LOG [NestApplication] Nest application successfully started +6ms
UseGuard

```

Efectivamente pasa por el guard y en postman obtenemos la respuesta.

```json

{
    "ok": true,
    "user": {
        "id": "07f90d2e-c328-4e67-96c6-05caa84833bd",
        "email": "michaelrojas25@gmail.com",
        "fullName": "Michael Rojas",
        "isActive": true,
        "roles": "inversor"
    }
}

```

#### Ahora si cambiamos el return de nuestro UseRoleGuard por false, nos arrojaria un error que prohibe la peticion

```ts

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserRoleGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    console.log('UseGuard');
    return false;
  }
}

```

#### En postman obtendriamos este error

```json

{
    "message": "Forbidden resource",
    "error": "Forbidden",
    "statusCode": 403
}

```

Y en consola se mostraria nuevamente el mensaje de UseGuard.

### Obtener roles en Metadata

Ahora, lo anterior es una prueba para configurar el guard, pero ahora necesitamos traer los roles de los usuarios que solicitan la peticion en nuestro controlador, esta configuracion la haremos en el mismo ***UseRoleGuard***. Crearemos un atributo o propiedad de tipo ***Reflector*** el cual me va ayudar a traer y mostrar informacion que me da los decoradores, precisamente el decorador con el string ***roles***.

```ts

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get( 'roles', context.getHandler() )

    console.log({ validRoles });

    console.log('UseGuard');
    return false;
  }
}


```

Cuando hagamos la peticion nuevamente a la url, en consola nos mostrara lo siguiente:

```bash

[Nest] 10584  - 21/10/2023, 11:13:16     LOG [RouterExplorer] Mapped {/weex/v1/auth/private2, GET} route +1ms
[Nest] 10584  - 21/10/2023, 11:13:16     LOG [NestApplication] Nest application successfully started +6ms
{ validRoles: [ 'admin', 'inversor' ] }
UseGuard

```

El siguiente paso es obtener el los datos del usuario que esta haciendo la peticion, este paso ya lo habiamos hecho anteriormente en otro decorador, esto lo hicimos en el decorador ***GetUser*** en el archivo ***get-user.decorator.ts*** que fueron la siguientes lineas.

```ts

( data: string, ctx: ExecutionContext ) => {
        
        const req = ctx.switchToHttp().getRequest();
        const user = req.user;

```

Si observamos el tipo de dato de la variable ***ctx*** ese tipo de dato ya lo tenemos en nuestro ***UseRoleGuard*** solo que la variable tiene otro nombre diferente, se llama ***context***
por ende podemos seguir los mismos pasos para obtener los datos del usuario, solo es copiar y pegar y cambiar el nombre de la variable, no olvidemos cambiar el ***return*** por true.

```ts

// user-role.guard.ts

import { CanActivate, ExecutionContext, Injectable, InternalServerErrorException } from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get( 'roles', context.getHandler() )

    const req = context.switchToHttp().getRequest();
    const user = req.user as InversorAuth;

    if ( !user ) {
        throw new InternalServerErrorException('Usuario no encontrado ( request )')
    }

    console.log({userRoles: user.roles});

    return true;
  }
}

```

Cuando enviemos la solicitud con postman entonces imprimira en consola el rol de ese usuario.

```bash

[Nest] 17096  - 21/10/2023, 11:31:22     LOG [RouterExplorer] Mapped {/weex/v1/auth/private, GET} route +1ms
[Nest] 17096  - 21/10/2023, 11:31:22     LOG [RouterExplorer] Mapped {/weex/v1/auth/private2, GET} route +1ms
[Nest] 17096  - 21/10/2023, 11:31:22     LOG [NestApplication] Nest application successfully started +7ms
{ userRoles: 'inversor' }

```

#### Solo queda validar que tipo de rol queremos permitir, podemos incluso copiar el mismo codigo y cambiar el nombre de la clase y el archivo si lo que buscamos es permitirle a los usuarios con cierto rol usar ciertas rutas y a otros usuarios por ejemplo los administradores usar otras rutas adicionales tambien, en conclusion todo quedaria asi:

```ts

import { CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { InversorAuth } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get( 'roles', context.getHandler() )

    const req = context.switchToHttp().getRequest();
    const user = req.user as InversorAuth;

    if ( !validRoles ) return true;
    if ( validRoles.length === 0 ) return true;

    if ( !user ) {
        throw new InternalServerErrorException('Usuario no encontrado ( request )')
    }

    // Si no envian ningun parametro en el decorador de SetMetada entonces lo deja pasar
    if ( !validRoles ) return true;

    // Si el usuario que intenta acceder a la ruta tiene uno de los roles especificados en el decorador SetMetadata entonces lo deja pasar
    if ( validRoles.includes( user.roles ) ) {
        return true;
    }

    throw new ForbiddenException({
      message: {
        error: `Usuario ${ user.fullName } no tiene permisos o el rol necesario para acceder a este recurso`,
        rol_requerido: validRoles,
        rol_actual: user.roles
      },
      error: 'Forbidden',
      statusCode: 403
      }
    )
  }
}

```

Es cuestion de nosotros donde queramos restringir el acceso a ciertos roles, por ejemplo: si usamos el decorador asi:


```ts

@Get('private2')
@SetMetadata('roles', ['admin'])
@UseGuards( AuthGuard(), UserRoleGuard )
privateRoute2(
  @GetUser() user: InversorAuth,
)
  {
    return {
      ok: true,
      user,
  }
}


```

#### Solo los que tengan rol de admin podran entrar a esa ruta.
#
### Ahora tenemos un problema, estamos propensos a equivocarnos por un letra mayuscula o un caracter en nuestro decorador SetMetadata vamos a solucionar eso.

Ejecutamos en la terminal el siguiente comando para crear un decorador, los demas decoradores que creamos, no se pueden crear de la siguiente forma:

```bash

nest g d auth/decorators/roleProtected --no-spected

```

Con esto nos creara un archivo que se llama role-protected.decorator.ts y lo organizamos de la siguiente forma:


```ts

import { SetMetadata } from '@nestjs/common';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: string[]) => {

    SetMetadata(META_ROLES, args);
} 


```

De esta forma garantizamos que el string ***roles*** solo estara definido 1 unica vez y no tendremos errores de caracteres o mayusculas, si necesitamos hacer algun cambio, solo lo hariamos ahi. Ahora vamos a ir al archivo de nuestra clase ***UserRoleGuard*** para pasarle esa constante o variable, hacemos el cambio en ***validRoles***.


```ts

import { CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected/role-protected.decorator';
import { InversorAuth } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get( META_ROLES, context.getHandler() )

```

#### Ahora vamos a crear un ***enum*** para definir los roles, el archivo se va a llamar ***valid.roles.ts*** y la interfaz ***ValidRoles*** con la enumeracion

```ts

export enum ValidRoles {
    admin = 'admin',
    inversor = 'inversor'
}

```

Una vez hecho esto importamos el enum en nuestro archivo ***role-protected.decorator.ts***, luego lo declaramos en el tipo de dato de ***args***

```ts

import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: ValidRoles[] ) => {

    return SetMetadata(META_ROLES, args);
} 

```

Ahora definimos el decorador en mi controlador de auth, de la siguiente manera:

```ts

@Get('private2')
  @RoleProtected( ValidRoles.Admin )
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRoute2(
    @GetUser() user: InversorAuth,
  )
  {
      return {
        ok: true,
        user,
    }
  }

```

### Con esto es suficiente, ahora el usuario que quiera usar esta url debe ser administrador.

## Custom Decorator

Ahora lo que vamos hacer es juntar todos los decoradores en uno solo, para que se vea mucho mejor, es decir agruparlo. Vamos a copiar la ruta del controlador que dejamos listo y cambiarmos los nombres para empezar.

```ts

@Get('private3')
  @RoleProtected( ValidRoles.Admin )
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRoute3(
    @GetUser() user: InversorAuth,
  )
  {
      return {
        ok: true,
        user,
    }
  }

```

En la carpeta de ***decoradores*** del directorio ***auth*** creamos otro decorador que se llame ***auth.decorator.ts*** y pegamos el siguiente codigo:

```ts

import { UseGuards, applyDecorators } from "@nestjs/common"
import { RoleProtected } from "./role-protected.decorator"
import { AuthGuard } from "@nestjs/passport"
import { ValidRoles } from "../interfaces/valid-roles"
import { UserRoleGuard } from "../guards/user-role/user-role.guard"

export function Auth(...roles: ValidRoles[]) {

    return applyDecorators(
        RoleProtected( ValidRoles.Admin ),
        UseGuards( AuthGuard(), UserRoleGuard ),
    )
}

```

Esto lo que hace es usar los dos decoradores que ya teniamos anteriormente en nuestros controladores, ahora lo que sigue es usarlo en nuestros controladores, recuerda que puedes usar un archivo de barril para hacer las exportanciones mas facil y sin acumularsen.

```ts

  @Get('private3')
  @Auth( ValidRoles.Admin )
  privateRoute3(
    @GetUser() user: InversorAuth,
  )
  {
      return {
        ok: true,
        user,
    }
  }


```

### Tiene que ser admin para poder usar la url.

# Usar el metodo de autenticacion en otros modulos o para cualquier ruta

Para hacer esto lo unico que debemos hacer es importar el ***AuthModule*** en el modulo donde lo vamos a usar, por ejemplo en registros:


```ts
// register.module.ts

import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InversorRegister } from './entities/register.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [RegisterController],
  providers: [RegisterService],
  imports: [
    TypeOrmModule.forFeature([ InversorRegister ]),
    AuthModule
  ],
  exports: [ TypeOrmModule, RegisterService ]
})
export class RegisterModule {}

```

Luego importamos el decorador en uno de nuestros controladores de register, se puede intentar enviar una solicitud sin un token y no va a funcionar la solicitud, si le establecemos un tipo de rol tambien funcionario de igual forma, bloqueando accesos a ciertos roles.

```ts

@Get()
  @Auth()
  findAll() {
    return this.registerService.findAll();
  }

```

# Fin de la autenticacion