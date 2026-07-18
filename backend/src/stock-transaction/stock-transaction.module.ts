import { Module } from '@nestjs/common';
import { StockTransactionController } from './stock-transaction.controller';

@Module({
  controllers: [StockTransactionController],
})
export class StockTransactionModule {}
