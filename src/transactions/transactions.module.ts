import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transactionrecor } from './entities/transaction.entity';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
  imports: [
    // TypeOrmModule.forFeature([ Transactionrecor ])
  ],
  // exports: [ TypeOrmModule ]
})
export class TransactionsModule {}
