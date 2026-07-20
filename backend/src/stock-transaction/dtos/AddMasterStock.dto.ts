import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class AddMasterStockDto {
  @IsString({ message: 'Nomor Transaksi Manual harus dalam format text' })
  nomor_transaksi!: string;

  @IsNotEmpty({ message: 'Tanggal tidak boleh kosong' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Tanggal harus dalam format yyyy-mm-dd',
  })
  tanggal_transaksi!: string;

  @IsNotEmpty({ message: 'SKU tidak boleh kosong' })
  @IsString({ message: 'SKU harus dalam format text' })
  sku!: string;

  @IsNotEmpty({ message: 'Quantity barang tidak boleh kosong' })
  @IsNumber({}, { message: 'Quantity barang harus dalam format text' })
  quantity!: number;

  @IsString({ message: 'Keterangan harus dalam format text' })
  keterangan!: string;
}
