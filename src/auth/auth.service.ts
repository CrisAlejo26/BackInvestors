import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto, LoginUserDto } from './dto';
import { Repository } from 'typeorm';
import { InversorAuth } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt.strategy.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService')

  constructor(
    @InjectRepository(InversorAuth) 
    private readonly inversorAuthRepository: Repository<InversorAuth>,
    private readonly jwtService: JwtService
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
      select: { email: true, password: true, id: true, isActive: true, fullName: true, atm: true, percentage: true } });

    if ( !user ) throw new UnauthorizedException("Credenciales no validas (correo electronico)")
    
    // Comparamos la contraseña que no sea igual
    if ( !bcrypt.compareSync(password, user.password ) ) {
      throw new UnauthorizedException("Credenciales no validas (contraseña)")
    }

    if ( !user.isActive ) {
      throw new UnauthorizedException("Credenciales no validas, tu usuario no se encuentra activo")
    }

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    }
  }

  private getJwtToken(payload: JwtPayload) {
    
    const token = this.jwtService.sign( payload );

    return token;
  }

  private handleErrors( error: any): never {
    if ( error.code === '23505') throw new BadRequestException(error.detail);
    
    this.logger.error(error);
    throw new InternalServerErrorException('Error al crear el registro');

  }
}

