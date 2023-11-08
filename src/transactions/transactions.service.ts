import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactionrecord } from './entities/transaction.entity';
import { InversorAuth } from '../auth/entities/user.entity';

@Injectable()
export class TransactionsService {

  private readonly logger = new Logger('TransactionsService')

  constructor(
    // Importamos la entidad de nuestra tabla
    @InjectRepository(Transactionrecord)
    private readonly registerRepository: Repository<Transactionrecord>
  ){}

  async findAll(userInversor: InversorAuth) {
    const terminal_id: string = userInversor.atm
    const fechaString = userInversor.inversionActiveDate
    const fromDate: Date = new Date(fechaString);
    const transactions = await this.registerRepository
      .createQueryBuilder('transaction')
      .where('transaction.terminal_id = :terminal_id', { terminal_id })
      .andWhere('transaction.servertime >= :fromDate', { fromDate })
      .andWhere('transaction.status IN (:...status)', { status: [1, 3] })
      .getMany();

    if (!transactions || transactions.length === 0) {
      throw new NotFoundException(`No se encontraron transacciones para el terminal con ID ${terminal_id} a partir de la fecha ${fromDate}`);
    }

    return transactions;
  }
}
