import { Test, TestingModule } from '@nestjs/testing';
import { StockTransactionController } from './stock-transaction.controller';

describe('StockTransactionController', () => {
  let controller: StockTransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockTransactionController],
    }).compile();

    controller = module.get<StockTransactionController>(
      StockTransactionController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
