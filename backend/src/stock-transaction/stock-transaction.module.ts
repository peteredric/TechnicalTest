import { Module } from '@nestjs/common';
import { StockTransactionController } from './stock-transaction.controller';
import { StockTransactionService } from './stock-transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterStock } from './entities/master-stock.entity';
import { MasterTransaction } from './entities/master-transaction.entity';
import { DateRunningNumber } from './entities/date-running-number.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MasterStock,
      MasterTransaction,
      DateRunningNumber,
    ]),
  ],
  controllers: [StockTransactionController],
  providers: [StockTransactionService],
})
export class StockTransactionModule {}
