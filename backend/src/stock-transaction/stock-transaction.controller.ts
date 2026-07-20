import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AddMasterStockDto } from './dtos/AddMasterStock.dto';
import { CreateMasterStockDto } from './dtos/CreateMasterStock.dto';
import { StockTransactionService } from './stock-transaction.service';
import { CancelTransationDto } from './dtos/CancelTransaction.dto';

@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),
)
@Controller('stock-transaction')
export class StockTransactionController {
  constructor(private stockTransactionService: StockTransactionService) {}

  @Post('/create-master-stock')
  async createMasterStock(
    @Body() createMasterDataDto: CreateMasterStockDto,
  ): Promise<string> {
    await this.stockTransactionService.createMasterStock(createMasterDataDto);
    return `Create Master Stock Berhasil`;
  }

  @Post('/add-transaction')
  async addTransaction(
    @Body() addMasterDataDto: AddMasterStockDto,
  ): Promise<string> {
    await this.stockTransactionService.addMasterStock(addMasterDataDto);
    return `Transaksi Penambahan Master Stock Berhasil`;
  }

  @Post('/cancel-transaction')
  async cancelTransaction(
    @Body() cancelTransactionDto: CancelTransationDto,
  ): Promise<string> {
    await this.stockTransactionService.cancelTransaction(cancelTransactionDto);
    return `Cancel Transaksi Master Stock Berhasil`;
  }

  @Get('/master-stock')
  async findAllMasterStock() {
    return this.stockTransactionService.findAll();
  }
  @Get('/master-stock/:sku')
  async findMasterStock(@Param('sku') sku: string) {
    return this.stockTransactionService.findMasterStock(sku);
  }
  @Get('/master-stock-simple')
  async findAllMasterStockSimple() {
    return this.stockTransactionService.listAllItems();
  }
  @Get('/master-transaction')
  async findAllTransaction() {
    return this.stockTransactionService.findMasterTransaction();
  }
}
