import { Controller, Get } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Auth, GetUser } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { InversorAuth } from '../auth/entities/user.entity';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @Auth( ValidRoles.Inversor )
  findOne(@GetUser() user: InversorAuth) {
    return this.transactionsService.findAll(user);
  }

}
