import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateRegisterDto } from './dto/create-register.dto';
import { UpdateRegisterDto } from './dto/update-register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InversorRegister } from './entities/register.entity';

@Injectable()
export class RegisterService {

  // Crear logger en consola para ver errores
  private readonly logger = new Logger('RegisterService')

  constructor(
    // Importamos la entidad de nuestra tabla
    @InjectRepository(InversorRegister)
    private readonly registerRepository: Repository<InversorRegister>
  ){}

  async create(createRegisterDto: CreateRegisterDto) {
    
    try {
      
      const createRegister = {...createRegisterDto, createdAt: new Date(), updatedAt: new Date()}

      const resul = this.registerRepository.create(createRegister);
      await this.registerRepository.save(resul);
      return resul

    } catch (error) {
      this.handleExceptions(error)
    }

  }

  findAll() {
    return this.registerRepository.find();
  }

  async findOne(id: string) {
    let register: InversorRegister;

    if (!isNaN(+id)) {
      register = await this.registerRepository.findOne({ id: id });
    } 
  }

  update(id: string, updateRegisterDto: UpdateRegisterDto) {
    return `This action updates a #${id} register`;
  }

  remove(id: string) {
    return `This action removes a #${id} register`;
  }

  // Manejo de errores
  private handleExceptions( error: any) {
    if ( error.code === '23505') throw new BadRequestException(error.detail);
      
      this.logger.error(error);

      throw new InternalServerErrorException('Error al crear el registro');
  }
}
