import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StockTransactionModule } from './stock-transaction/stock-transaction.module';

@Module({
  imports: [StockTransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
