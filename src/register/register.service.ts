import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateRegisterDto } from './dto/create-register.dto';
import { UpdateRegisterDto } from './dto/update-register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InversorRegister } from './entities/register.entity';
import { InversorAuth } from 'src/auth/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class RegisterService {

  // Crear logger en consola para ver errores
  private readonly logger = new Logger('RegisterService')

  constructor(
    // Importamos la entidad de nuestra tabla
    @InjectRepository(InversorRegister)
    private readonly registerRepository: Repository<InversorRegister>,
    @InjectRepository(InversorAuth)
    private readonly authRepository: Repository<InversorAuth>
  ){}

  async create(createRegisterDto: CreateRegisterDto) {
    let createRegister = {...createRegisterDto, createdAt: new Date(), updatedAt: new Date()}
    try {
      const fieldsToCheck = ['fullName', 'email', 'address', 'dni', 'bussiness', 'nif'];

      // Valida si los campos existen y los convierte en minusculas
      fieldsToCheck.forEach(field => {
        if(createRegisterDto[field]) {
          createRegister[field] = createRegisterDto[field].toLowerCase();
        }
      });
      const resul = this.registerRepository.create(createRegister);
      return await this.registerRepository.save(resul);

    } catch (error) {
      this.handleExceptions(error)
    }

  }

  findAll() {
    return this.registerRepository.find();
  }

  async findOne(id: string) {
    
    const inversor = await this.registerRepository.findOneBy({ id })

    if ( !inversor) {
      throw new NotFoundException(`El inversor con id ${id} no existe`)
    }

    return inversor;
  }

  async update(id: string, updateRegisterDto: UpdateRegisterDto) {
    let search = await this.findOne(id);
    let createRegister = {...updateRegisterDto, updatedAt: new Date()}

    const fieldsToCheck = ['fullName', 'email', 'address', 'dni', 'bussiness', 'nif'];

    // Valida si los campos existen y los convierte en minusculas
    fieldsToCheck.forEach(field => {
      if(updateRegisterDto[field]) {
        createRegister[field] = updateRegisterDto[field].toLowerCase();
      }
    });

    const register = await this.registerRepository.preload({
      id: id,
      ...createRegister
    })

    if ( !search ) throw new NotFoundException(`El inversor con id ${id} no existe`)
    
    try {
      return this.registerRepository.save( register );
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async remove(id: string) {
    const search = await this.findOne(id);
    if ( search ) {
      return await this.registerRepository.remove(search);
    }
  }

  // Manejo de errores
  private handleExceptions( error: any) {
    if ( error.code === '23505') throw new BadRequestException(error.detail);
      
      this.logger.error(error);

      throw new InternalServerErrorException('El usuario ya existe');
  }
}
