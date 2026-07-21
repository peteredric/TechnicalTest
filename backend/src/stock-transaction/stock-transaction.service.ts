import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MasterStock } from './entities/master-stock.entity';
import { CreateMasterStockDto } from './dtos/CreateMasterStock.dto';
import { AddMasterStockDto } from './dtos/AddMasterStock.dto';
import { MasterTransaction } from './entities/master-transaction.entity';
import { DateRunningNumber } from './entities/date-running-number.entity';
import { Repository, DataSource, QueryFailedError } from 'typeorm';
import { toRoman } from '../helpers/roman-numeral-helper';
import { CancelTransationDto } from './dtos/CancelTransaction.dto';
import { isValidDateString } from '../helpers/is-valid-date-string-helper';
import { MasterStockListItemDto } from './dtos/MasterStockListItem.dto';

// Custom type layer for ESLint safety when checking driver errors
interface PostgresDriverError extends Error {
  code: string;
  detail?: string;
}

@Injectable()
export class StockTransactionService {
  constructor(
    @InjectRepository(MasterStock)
    private masterStockRepo: Repository<MasterStock>,
    @InjectRepository(MasterTransaction)
    private masterTransactionRepo: Repository<MasterTransaction>,
    private readonly dataSource: DataSource,
  ) {}

  async createMasterStock(
    createMasterStockDto: CreateMasterStockDto,
  ): Promise<MasterStock> {
    try {
      const stock = this.masterStockRepo.create(createMasterStockDto);
      await this.masterStockRepo.insert(stock);
      return stock;
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        const dbError = error.driverError as PostgresDriverError;

        // Handle Conflict / Duplicate Primary Key (PostgreSQL code '23505')
        if (dbError.code === '23505') {
          throw new ConflictException(
            `Conflict: Barang dengan SKU ${createMasterStockDto.sku} duplikat/sudah ada.`,
          );
        }
      }
      if (error instanceof Error) {
        throw new Error(`Internal database exception: ${error.message}`);
      } else {
        console.error('Terjadi kesalahan yang tidak diketahui.');
        throw error;
      }
    }
  }

  async addMasterStock(
    addMasterStockDto: AddMasterStockDto,
  ): Promise<MasterTransaction> {
    return this.dataSource.transaction(async (manager) => {
      let noTransaksi = addMasterStockDto.nomor_transaksi;
      if (noTransaksi.length === 0) {
        // validate date
        if (!isValidDateString(addMasterStockDto.tanggal_transaksi)) {
          throw new BadRequestException(
            'Invalid tanggal transaksi. Pastikan tanggal dalam format yyyy-mm-dd',
          );
        }
        // auto generate ID if noTransaksi is empty
        const date = new Date(
          `${addMasterStockDto.tanggal_transaksi}T00:00:00`,
        );
        const dayName = date.toLocaleDateString('id-ID', { weekday: 'long' });
        const monthRomawi = toRoman(date.getMonth() + 1);
        const kombinasi_tanggal = `${dayName}/${monthRomawi}/${date.getFullYear()}`;
        await manager.upsert(
          DateRunningNumber,
          {
            kombinasi_tanggal: kombinasi_tanggal,
            running_number: 0,
          },
          {
            conflictPaths: ['kombinasi_tanggal'],
            skipUpdateIfNoValuesChanged: true,
          },
        );

        const dateRunningNumber = await manager.findOne(DateRunningNumber, {
          where: { kombinasi_tanggal: kombinasi_tanggal },
          lock: { mode: `pessimistic_write` },
        });

        if (!dateRunningNumber) {
          throw new NotFoundException(
            `Date running number table ${dateRunningNumber!.kombinasi_tanggal} failed to create`,
          );
        }

        let foundUnique = false;

        do {
          // running number should be fetched from the DateRunningNumber table
          // check if the currently generated sku already exist, if yes, retry
          dateRunningNumber.running_number++;
          noTransaksi = `STK/${kombinasi_tanggal}/${String(dateRunningNumber.running_number).padStart(5, '0')}`;
          foundUnique = await manager.existsBy(MasterTransaction, {
            nomor_transaksi: noTransaksi,
          });
        } while (foundUnique);

        await manager.save(dateRunningNumber);
      }
      // create new transaction with said noTransaksi
      // here also return if error only for manual noTransaksi
      const masterTransaction = manager.create(MasterTransaction, {
        nomor_transaksi: noTransaksi,
        sku: addMasterStockDto.sku,
        quantity: addMasterStockDto.quantity,
        keterangan: addMasterStockDto.keterangan,
      });
      try {
        await manager.insert(MasterTransaction, masterTransaction);
      } catch (error: unknown) {
        if (error instanceof QueryFailedError) {
          const dbError = error.driverError as PostgresDriverError;

          // Handle Conflict / Duplicate Primary Key (PostgreSQL code '23505')
          if (dbError.code === '23505') {
            throw new ConflictException(
              `Conflict: Nomor Transaksi ${addMasterStockDto.nomor_transaksi} duplikat/sudah ada.`,
            );
          }

          // Handle Bad Request / Foreign Key Mismatch (PostgreSQL code '23503')
          if (dbError.code === '23503') {
            throw new BadRequestException(
              `Bad Request: Item SKU ${addMasterStockDto.sku} tidak ada.`,
            );
          }
        }
        if (error instanceof Error) {
          throw new Error(`Internal database exception: ${error.message}`);
        } else {
          console.error('Terjadi kesalahan yang tidak diketahui.');
          throw error;
        }
      }

      // Finally, update master stock so it increases by the quantity,
      // and also update quantity penjualan based on conversion value from konversi
      const updatedMasterStock = await manager.findOne(MasterStock, {
        where: { sku: addMasterStockDto.sku },
        lock: { mode: `pessimistic_write` },
      });

      if (!updatedMasterStock) {
        throw new NotFoundException(
          `Master stock dengan SKU ${addMasterStockDto.sku} tidak ditemukan`,
        );
      }

      updatedMasterStock.quantity_pembelian =
        Number(updatedMasterStock.quantity_pembelian) +
        addMasterStockDto.quantity;

      updatedMasterStock.quantity_penjualan =
        Number(updatedMasterStock.quantity_penjualan) +
        addMasterStockDto.quantity * Number(updatedMasterStock.konversi);

      await manager.save(updatedMasterStock);
      return masterTransaction;
    });
  }

  async cancelTransaction(cancelTransactionDto: CancelTransationDto) {
    return this.dataSource.transaction(async (manager) => {
      // find transaction to cancel
      const cancelledTransaction = await manager.findOne(MasterTransaction, {
        where: {
          nomor_transaksi: cancelTransactionDto.nomor_transaksi,
        },
        lock: { mode: `pessimistic_write` },
      });

      // throw error if not found
      if (cancelledTransaction === null) {
        throw new NotFoundException(
          `Transaksi dengan nomor ${cancelTransactionDto.nomor_transaksi} tidak ditemukan`,
        );
      }

      // throw error if transaction is already cancelled
      if (cancelledTransaction.is_cancelled) {
        throw new ConflictException(
          `Transaksi dengan nomor ${cancelTransactionDto.nomor_transaksi} sudah di-cancel`,
        );
      }

      // cancel transaction
      cancelledTransaction.is_cancelled = true;
      await manager.save(cancelledTransaction);

      // find the item of this transaction, and update the stock
      const updatedMasterStock = await manager.findOne(MasterStock, {
        where: {
          sku: cancelledTransaction.sku,
        },
        lock: { mode: `pessimistic_write` },
      });

      if (!updatedMasterStock) {
        throw new NotFoundException(
          `Tidak bisa cancel transaksi karena master stock dengan SKU ${cancelledTransaction.sku} tidak ditemukan`,
        );
      }

      // reduce the stock of this item after cancellation
      updatedMasterStock.quantity_pembelian =
        Number(updatedMasterStock.quantity_pembelian) -
        Number(cancelledTransaction.quantity);

      updatedMasterStock.quantity_penjualan =
        Number(updatedMasterStock.quantity_penjualan) -
        Number(cancelledTransaction.quantity) *
          Number(updatedMasterStock.konversi);

      await manager.save(updatedMasterStock);
    });
  }

  async findAll() {
    return this.masterStockRepo.find();
  }

  async findMasterStock(sku: string) {
    return this.masterStockRepo.findOne({ where: { sku: sku } });
  }

  async listAllItems(): Promise<MasterStockListItemDto[]> {
    const items = await this.masterStockRepo.find({
      select: {
        sku: true,
        nama_barang: true,
      },
    });

    return items.map((item) => ({
      sku: item.sku,
      nama_barang: item.nama_barang,
    }));
  }

  async findMasterTransaction() {
    return this.masterTransactionRepo.find();
  }
}
