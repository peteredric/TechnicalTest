import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMasterStockDto {
  @IsNotEmpty({ message: 'Nama barang tidak boleh kosong' })
  @IsString({ message: 'Nama barang harus dalam format text' })
  nama_barang!: string;

  @IsNotEmpty({ message: 'SKU tidak boleh kosong' })
  @IsString({ message: 'SKU harus dalam format text' })
  sku!: string;

  @IsNotEmpty({ message: 'Satuan Pembelian tidak boleh kosong' })
  @IsString({ message: 'Satuan Pembelian harus dalam format text' })
  satuan_pembelian!: string;

  @IsNotEmpty({ message: 'Satuan Penjualan tidak boleh kosong' })
  @IsString({ message: 'Satuan Penjualan harus dalam format text' })
  satuan_penjualan!: string;

  @IsNotEmpty({ message: 'Konversi tidak boleh kosong' })
  @IsNumber({}, { message: 'Konversi harus dalam format angka/desimal' })
  konversi!: number;
}
