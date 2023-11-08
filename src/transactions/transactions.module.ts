import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transactionrecord } from './entities/transaction.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
  imports: [
    TypeOrmModule.forFeature([ Transactionrecord ]),
    AuthModule
  ],
  exports: [ TypeOrmModule ]
})
export class TransactionsModule {}
