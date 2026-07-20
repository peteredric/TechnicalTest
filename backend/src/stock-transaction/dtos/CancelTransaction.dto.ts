import { IsNotEmpty, IsString } from 'class-validator';

export class CancelTransationDto {
  @IsNotEmpty({ message: 'Nomor Transaksi tidak boleh kosong' })
  @IsString({ message: 'Nomor Transaksi harus dalam format text' })
  nomor_transaksi!: string;
}
