import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { MasterTransaction } from './master-transaction.entity';

@Entity()
export class MasterStock {
  @PrimaryColumn()
  sku!: string;

  @Column()
  nama_barang!: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  quantity_pembelian!: number;

  @Column()
  satuan_pembelian!: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  quantity_penjualan!: number;

  @Column()
  satuan_penjualan!: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  konversi!: number;

  @OneToMany(() => MasterTransaction, (transaction) => transaction.masterStock)
  transactions!: MasterTransaction[];
}
